const express = require('express');
const multer = require('multer')

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploads/assignments')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
  })

var upload = multer({ storage: storage })
const router = express.Router();

module.exports = (param) => {

    const { assignments, projectAssignments } = param;

    router.get('/', async (req, res, next) => {
        try {
            const assignmentslist = await assignments.getList();
            return res.render('portal/moduleLeader/assignments.hbs', {
                page: 'assignments',
                assignmentslist,
                success: req.query.success,
                user: req.session.user,
                backButton: '/portal/moduleLeader',
                homeButton: '/portal/moduleLeader',
            });
        } catch(err) {
            return err;
        }
    });

    router.get('/detail/:Aid', async (req, res, next) => {
        try {
            const Aid = req.params.Aid;
            const promises = [];
            promises.push(assignments.getDetails(Aid));
            promises.push(assignments.getAssignedProjectsList(Aid));
            promises.push(assignments.getUnAssignedProjectsList(Aid));
            const results = await Promise.all(promises);
            res.render('portal/moduleLeader/assignments/detail.hbs', {
                details: results[0].dataValues,
                assignedProjects: results[1].projects,
                noProjects: results[2],
                success: req.query.success,
                user: req.session.user,
                backButton: '/portal/moduleLeader/assignments',
                homeButton: '/portal/moduleLeader',
            });
        } catch(err) {
            return next(err);
            }
        });

    router.get('/detail/:Aid/upload',upload.single('myFile'), async (req, res, next) => {
        try {
            var Aid = req.params.Aid;
            var details = await assignments.getDetails(Aid);
            res.render('portal/moduleLeader/assignments/file.hbs', {
                details, Aid,
                success: req.query.success,
                user: req.session.user,
                backButton: '/portal/moduleLeader/assignments',
                homeButton: '/portal/moduleLeader',
            });
        } catch(err) {
            return next(err);
        }
    });

    router.post('/detail/:Aid/upload',upload.single('myFile'), async (req, res, next) => {
        try {

            const Aid = req.params.Aid;
            const file = req.file.filename;
            await assignments.setFile(file, Aid);

            return res.redirect('/portal/moduleLeader/assignments/detail/' + Aid + '?success=true');
        } catch(err) {
            return next(err);
        }
    });

    router.get('/detail/:Aid/download/:filename', async (req, res) => {
        try {
            //get the path to where the file is stored on the server
            const filename = req.params.filename
            const path = require('path');
            //gets the base directory of the application then goes to assignments folder
            const file = path.dirname(require.main.filename) + '/../public/uploads/assignments/' + filename;
            res.download(file);

        } catch(err) {
            return next(err);
        }
    });
        
    // this is page returned after form is filled in to add a new assignment
    // it trims all of the inputs from the form, then checks all of the necessary information was entered
    //if not - it returns to the same page with an error and returns the values provided in the form along with the assignment list
    //otherwise it uses the inputted values to add an entry into the assignment table of the db using the model method addEntry()
    // it then redirects to the same page with 
    router.post('/add', upload.single('myFile'), async (req, res, next) => {
        try {
            const title = req.body.title.trim();
            const subdate = req.body.subdate.trim();
            const maxmark = req.body.maxmark;
            const group_assignment = req.body.groupAssignment.trim();
            const description = req.body.description.trim();

            if(!title || !subdate || !maxmark || !group_assignment ) {
                // const assignmentslist = await assignments.getList();
                // return res.render('portal/moduleLeader/assignments.hbs', {
                //     page: 'addassignments',
                //     assignmentslist,
                //     success: req.query.success,
                //     user: req.session.user,
                //     backButton: '/portal/moduleLeader',
                //     homeButton: '/portal/moduleLeader',
                // });
                return res.redirect('/portal/moduleLeader/assignments?success=false');
            }

            await assignments.addEntry(title, subdate, maxmark, group_assignment, description);
            return res.redirect('/portal/moduleLeader/assignments?success=true');

        } catch(err) {
            return next(err);
        }
        
    });

    router.post('/edit/:Aid', upload.single('myFile'), async (req, res, next) => {
        try {
            const Aid = req.params.Aid;
            const title = req.body.title.trim();
            const subdate = req.body.subdate.trim();
            const maxmark = req.body.maxmark;
            const group_assignment = req.body.groupAssignment.trim();
            const description = req.body.description.trim();

            if(!title || !subdate || !maxmark || !group_assignment ) {
                // const assignmentslist = await assignments.getList();
                // return res.render('portal/moduleLeader/assignments.hbs', {
                //     page: 'addassignments',
                //     assignmentslist,
                //     success: req.query.success,
                //     user: req.session.user,
                //     backButton: '/portal/moduleLeader',
                //     homeButton: '/portal/moduleLeader',
                // });
                return res.redirect('/portal/moduleLeader/assignments?success=false');
            }

            await assignments.updateEntry(Aid, title, subdate, maxmark, group_assignment, description);
            return res.redirect('/portal/moduleLeader/assignments?success=true');

        } catch(err) {
            return next(err);
        }

    });

    router.post('/delete/:Aid', async (req, res, next) => {
        try {
            const Aid = req.params.Aid;
            await assignments.deleteEntry(Aid);
            return res.redirect('/portal/moduleLeader/assignments?success=true');
        } catch(err) {
            return next(err);
        }

    });

    router.get('/:Aid/addProject/:Pid', async (req, res, next) => {
        try {
            const Aid = req.params.Aid;
            const Pid = req.params.Pid;

            await assignments.addProject(Aid, Pid);

            return res.redirect('/portal/moduleLeader/assignments/detail/' + Aid + '?success=true');

        } catch(err) {
            return next(err);
        }
    });


    router.get('/:Aid/removeProject/:Pid', async (req, res, next) => {
        try {
            const Aid = req.params.Aid;
            const Pid = req.params.Pid;

            await assignments.removeProject(Aid, Pid);

            return res.redirect('/portal/moduleLeader/assignments/detail/' + Aid + '?success=true');

        } catch(err) {
            return next(err);
        }
    });
    
    return router;
};
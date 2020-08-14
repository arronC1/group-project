const express = require('express');
const multer = require('multer')
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploads/submissions')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
  })

const upload = multer({ storage: storage })
const router = express.Router();

module.exports = (param) => {

    const { assignments, submissions, students, projectGroups } = param;

    router.get('/', async (req, res, next) => {
        try {
            const assignmentslist = await assignments.getListForStudent(req.session.user.username, students, projectGroups);
            return res.render('portal/student/coursework.hbs', {
                page: 'Coursework',
                assignmentslist,
                success: req.query.success,
                user: req.session.user,
                backButton: '/portal/student',
                homeButton: '/portal/student',
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
            promises.push(submissions.getSubmissionsList(Aid, req.session.user.username, students, assignments));
            const results = await Promise.all(promises);
            res.render('portal/student/coursework/detail.hbs', {
                details: results[0].dataValues,
                submissions: results[1],
                success: req.query.success,
                user: req.session.user,
                backButton: '/portal/student/coursework',
                homeButton: '/portal/student',
            });
        } catch(err) {
            return next(err);
            }
        });

    router.get('/detail/:Aid/upload',upload.single('myFile'), async (req, res, next) => {
        try {
            var Aid = req.params.Aid;
            var details = await assignments.getDetails(Aid);
            res.render('portal/student/coursework/file.hbs', {
                details, Aid,
                success: req.query.success,
                user: req.session.user,
                backButton: '/portal/student/coursework',
                homeButton: '/portal/student',
            });
        } catch(err) {
            return next(err);
        }
    });

    router.post('/detail/:Aid/upload',upload.single('myFile'), async (req, res, next) => {
        try {

            const Aid = req.params.Aid;
            const file = req.file.filename;
            const title = req.body.title;
            await submissions.addEntry(Aid, assignments, req.session.user.username, students, file, title);

            return res.redirect('/portal/student/coursework/detail/' + Aid + '?success=true');
        } catch(err) {
            return next(err);
        }
    });

    router.get('/detail/:SUBid/download/:filename', async (req, res) => {
        try {
            //get the path to where the file is stored on the server
            const filename = req.params.filename
            const path = require('path');
            //gets the base directory of the application then goes to assignments folder
            const file = path.dirname(require.main.filename) + '/../public/uploads/submissions/' + filename;
            res.download(file);

        } catch(err) {
            return next(err);
        }
    });

    router.get('/detail/:Aid/delete/:SUBid/:filename', async (req, res) => {
        try {
            //get the path to where the file is stored on the server
            const Aid = req.params.Aid
            const SUBid = req.params.SUBid
            const filename = req.params.filename
            const path = require('path');
            //gets the base directory of the application then goes to assignments folder
            const file = path.dirname(require.main.filename) + '/../public/uploads/submissions/' + filename;

            fs.unlinkSync(file);

            await submissions.deleteEntry(SUBid);

            return res.redirect('/portal/student/coursework/detail/' + Aid + '?success=true');


        } catch(err) {
            return next(err);
        }
    });
    
    return router;
};
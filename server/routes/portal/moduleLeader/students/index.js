const express = require('express');
const fileParser = require("../../../../views/helpers/fileParser.js");
const router = express.Router();

module.exports = (param) => {

    const { students, studentsSQL, projectGroups, projectGroupsSQL } = param;

    //this is the route returned for the base of the students section - it renders the students page with parameters for the list of students in db
    // and a success code
    router.get('/', async (req, res, next) => {
        try {
            const studentslist = await students.getList();
            return res.render('portal/moduleLeader/students.hbs', {
                page: 'Students',
                studentslist,
                success: req.query.success,
                user: req.session.user,
                backButton: '/portal/moduleLeader',
                homeButton: '/portal/moduleLeader',
            });
        } catch(err) {
            return err;
        }
    });


    // this is page returned after form is filled in to add a new student
    // it trims all of the inputs from the form, then checks all of the necessary information was entered
    //if not - it returns to the same page with an error and returns the values provided in the form along with the student list
    //otherwise it uses the inputted values to add an entry into the student table of the db using the model method addEntry()
    // it then redirects to the same page with 
    router.post('/add', async (req, res, next) => {
        try {
            const sfirstname = req.body.sfirstname.trim();
            const ssurname = req.body.ssurname.trim();
            const sstudentNumber = req.body.sstudentNumber.trim();
            const semail = req.body.semail.trim();

            if(!sfirstname || !ssurname || !sstudentNumber) {
                // const studentslist = await students.getList();
                // return res.render('portal/moduleLeader/students.hbs', {
                //     page: 'Students',
                //     studentslist,
                //     success: req.query.success,
                //     user: req.session.user,
                //     backButton: '/portal/moduleLeader',
                //     homeButton: '/portal/moduleLeader',
                // });
                return res.redirect('/portal/moduleLeader/students?success=false');
            }
            
            await students.addEntry(sfirstname, ssurname, sstudentNumber, semail);
            return res.redirect('/portal/moduleLeader/students?success=true');
        } catch(err) {
            return next(err);
        }
        
    });

    router.post('/edit/:sid', async (req, res, next) => {
        try {
            const sid = req.params.sid;
            const sfirstname = req.body.sfirstname.trim();
            const ssurname = req.body.ssurname.trim();
            const sstudentNumber = req.body.sstudentNumber.trim();
            const semail = req.body.semail.trim();

            if(!sfirstname || !ssurname || !sstudentNumber) {
                // const studentslist = await students.getList();
                // return res.render('portal/moduleLeader/students.hbs', {
                //     page: 'Students',
                //     studentslist,
                //     success: req.query.success,
                //     user: req.session.user,
                //     backButton: '/portal/moduleLeader',
                //     homeButton: '/portal/moduleLeader',
                // });
                return res.redirect('/portal/moduleLeader/students?success=false');
            }

            await students.updateEntry(sid, sfirstname, ssurname, sstudentNumber, semail);
            return res.redirect('/portal/moduleLeader/students?success=true');
        } catch(err) {
            return next(err);
        }

    });

    router.post('/delete/:sid', async (req, res, next) => {
        try {
            const sid = req.params.sid;
            await students.deleteEntry(sid);
            return res.redirect('/portal/moduleLeader/students?success=true');
        } catch(err) {
            return next(err);
        }

    });

    router.get('/detail/:sID', async (req, res, next) => {
    try {
        const sID = req.params.sID;
        const promises = [];
        promises.push(students.getDetails(sID));
        promises.push(projectGroups.getStudentsGroup(sID));
        promises.push(projectGroups.getList());
        const results = await Promise.all(promises);

        let group =  results[1]

        if(group) {
            group = group.dataValues
        }

        res.render('portal/moduleLeader/students/detail.hbs', {
            details: results[0].dataValues,
            group: group,
            allGroups: results[2],
            success: req.query.success,
            user: req.session.user,
            backButton: '/portal/moduleLeader/students',
            homeButton: '/portal/moduleLeader',
        });
    } catch(err) {
        return next(err);
        }
    });
    
    router.get('/:sID/addGroup/:gid', async (req, res, next) => {
        try {
            const sID = req.params.sID;
            const gid = req.params.gid;
            await students.setGID(sID, gid)

            const promises = [];
            promises.push(students.getDetails(sID));
            promises.push(projectGroups.getStudentsGroup(sID));
            promises.push(projectGroups.getList());
            const results = await Promise.all(promises);

            let group =  results[1]

            if(group) {
                group = group.dataValues
            }

            res.render('portal/moduleLeader/students/detail.hbs', {
                details: results[0].dataValues,
                group: group,
                allGroups: results[2],
                success: req.query.success,
                user: req.session.user,
                backButton: '/portal/moduleLeader/students',
                homeButton: '/portal/moduleLeader',
            });
        } catch(err) {
            return next(err);
        }
    });

    router.get('/:sID/removeGroup/:gid', async (req, res, next) => {
        try {
            const sID = req.params.sID;
            await students.removeGID(sID);

            const promises = [];
            promises.push(students.getDetails(sID));
            promises.push(students.getStudentsGroup(sID));
            promises.push(projectGroups.getList());
            const results = await Promise.all(promises);

            res.render('portal/moduleLeader/students/detail.hbs', {
                details: results[0].dataValues,
                group: results[1].dataValues,
                allGroups: results[2],
                success: req.query.success,
                user: req.session.user,
                backButton: '/portal/moduleLeader/students',
                homeButton: '/portal/moduleLeader',
            });
        } catch(err) {
            return next(err);
        }
    });

    router.get('/loadCSV',  (req, res, next) => {
        console.log("### BEGIN READ FILE ###");
        /*data = await fileParser.readCSVFile("server/views/helpers/file.csv");
        for (let entry of data) {
            await students.addEntry(entry[0], entry[1], entry[2], entry[3]);
        }*/

        fileParser.readCSVFilePromise("server/views/helpers/file.csv").then(async function(data) {
            for (let entry of data) {
                await students.addEntry(entry[0], entry[1], entry[2], entry[3]);
            }
        });
        
        return res.redirect("/portal/moduleLeader/students");
    });
    
    return router;
};
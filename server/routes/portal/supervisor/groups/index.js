const express = require('express');

const router = express.Router();

module.exports = (param) => {

    const { supervisors, projectGroups, contribution, students } = param;

    const termWeeks = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24];

    // supervisors groups list
    router.get('/', async(req, res, next) => {
        try {
            const promises = [];
            promises.push(supervisors.getGroupsFromUsername(req.session.user.username));
            const results = await Promise.all(promises);
            return res.render('portal/supervisor/groups.hbs', {
                page: 'Supervisor Portal',
                user: req.session.user,
                groups: results[0],
                backButton: '/portal/supervisor',
                homeButton: '/portal/supervisor',
            });
        } catch (err) {
            return err;
        }
    });

    // supervisors group details
    router.get('/detail/:gid', async(req, res, next) => {
        try {
            const gid = req.params.gid;
            const promises = [];
            promises.push(projectGroups.getGDetails(gid));
            promises.push(projectGroups.getMembers(gid));
            promises.push(projectGroups.getGClient(gid));
            const results = await Promise.all(promises);
            return res.render('portal/supervisor/groups/detail.hbs', {
                page: 'Supervisor Portal',
                user: req.session.user,
                details: results[0][0].dataValues,
                members: results[1],
                client: results[2],
                backButton: '/portal/supervisor/groups',
                homeButton: '/portal/supervisor',
            });
        } catch (err) {
            return err;
        }
    });

    // supervisor group contribution
    router.get('/contribution/:gid/:selectedWeek?', async(req, res, next) => {
        try {
            const gid = req.params.gid;

            let selectedWeek = Number(req.params.selectedWeek);
            if(!selectedWeek) {
                selectedWeek = 0;
            }
            console.log('selected week is: ' + selectedWeek);

            //get the contribution for the current group selected
            const promises = [];
            if(selectedWeek === 0){
                //get all contribution logs for the group ordered by week
                promises.push(contribution.supGroupCont(gid));
            } else {
                //get all logs for contribution of the selected week
                promises.push(contribution.supWeeklyCont(gid, selectedWeek));
            }
            promises.push(contribution.getWeeksForGroup(gid));
            promises.push(contribution.supGroupAvg(gid));
            promises.push(projectGroups.getGDetails(gid));
            const results = await Promise.all(promises);

            return res.render('portal/supervisor/groups/contribution.hbs', {
                page: 'Supervisors Portal',
                user: req.session.user,
                groupLog: results[0],
                weekList: results[1],
                selectedWeek: selectedWeek,
                termWeeks: termWeeks,
                groupAvgCont: results[2],
                details: results[3][0].dataValues,
                backButton: '/portal/supervisor/groups',
                homeButton: '/portal/supervisor',
            });
        } catch (err) {
            return err;
        }
    });

    // supervisor group contribution - week to display selected
    router.post('/contribution/:gid', async(req, res, next) => {
        try {
            const gid = req.params.gid;
            const selectedWeek = req.body.selectedWeek;
            return res.redirect('/portal/supervisor/groups/contribution/' + gid + '/' + selectedWeek);
            // const gid = req.params.gid;
            // const selectedWeek = req.body.selectedWeek;
            // //check if all weeks (0) selected, or a specific week
            //
            // const promises = [];
            // if(selectedWeek == 0){
            //     //get all contribution logs for the group ordered by week
            //     promises.push(contribution.supGroupCont(gid));
            // } else {
            //     //get all logs for contribution of the selected week
            //     promises.push(contribution.supWeeklyCont(gid, selectedWeek));
            // }
            //
            // promises.push(contribution.getWeeks());
            // promises.push(contribution.supGroupAvg(gid));
            // promises.push(projectGroups.getGDetails(gid));
            // const results = await Promise.all(promises);
            //
            // return res.render('portal/supervisor/groups/contribution.hbs', {
            //     page: 'Supervisors Portal',
            //     user: req.session.user,
            //     groupLog: results[0],
            //     weekList: results[1],
            //     termWeeks: termWeeks,
            //     groupAvgCont: results[2],
            //     details: results[3][0].dataValues,
            //     backButton: '/portal/supervisor/groups',
            //     homeButton: '/portal/supervisor',
            // });

        } catch (err) {
            return err;
        }
    });

    // supervisor group contribution - edit entry
    router.post('/contribution/:gid/edit/:sid', async(req, res, next) => {
        try {
            const gid = req.params.gid;
            const sid = req.params.sid;
            const student = req.body.student;
            const hours = req.body.hours;
            const tasks = req.body.tasks;
            const selectedWeek = req.body.week;

            //get the list of weeks that have entries added in the db
            // var weekList = await contribution.getWeeks();
            // var termWeeks = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24];

            // var groupAvgCont = await contribution.supGroupAvg(gid);

            await contribution.updateEntry(hours, tasks, selectedWeek, student, students);
            // var groupLog = await contribution.supWeeklyCont(gid, selectedWeek);
            return res.redirect('/portal/supervisor/groups/contribution/' + gid + '?success=true');
        } catch (err) {
            return err;
        }
    });

    // supervisor group contribution - delete entry
    router.post('/contribution/:gid/delete/:sid', async(req, res, next) => {
        try {
            const gid = req.params.gid;
            const sid = req.params.sid;
            const week = req.body.week;
            await contribution.deleteEntry(sid, week);
            return res.redirect('/portal/supervisor/groups/contribution/' + gid + '?success=true');
        } catch (err) {
            return err;
        }
    });

    // supervisor group attendance
    router.get('/attendance/:gid', async(req, res, next) => {
        try {
            const gid = req.params.gid;
            return res.render('portal/supervisor/groups/attendance.hbs', {
                page: 'Supervisors Portal',
                user: req.session.user,
                gid: gid,
                backButton: '/portal/supervisor/groups',
                homeButton: '/portal/supervisor',
            });
        } catch (err) {
            return err;
        }
    });

    return router;
};
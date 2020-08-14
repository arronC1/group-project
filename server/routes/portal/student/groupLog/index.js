const express = require('express');

const router = express.Router();

module.exports = (param) => {

    const { students, projectGroups, contribution, studentsSQL } = param;
    const weeks = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24];

    // Student Group log
    router.get('/:selectedWeek?', async (req, res, next) => {
        try {
            //initially start on showing contribution for week 1
            // const weekNo = 0;
            let selectedWeek = Number(req.params.selectedWeek);
            if(!selectedWeek) {
                selectedWeek = 0;
            }
            console.log('selected week is: ' + selectedWeek);

            //get the contribution for the group the current student is in
            let groupLog
            if(selectedWeek === 0){
                //get all contribution logs for the group ordered by week
                console.log('about to call contribution for whole grouplog');
                groupLog = await contribution.getGroupContribution(req.session.user.username, students);
                console.log('got it : ' + groupLog);
            } else {
                //get all logs for contribution of the selected week
                console.log('about to call contribution for grouplog');
                groupLog = await contribution.getGroupWeeklyContribution(req.session.user.username, selectedWeek, students);
                console.log('got it : ' + groupLog);
            }

            // const groupLog = await contribution.getGroupWeeklyContribution(req.session.user.username, weekNo, students);
            console.log('got it : ' + groupLog);
            // console.log('got it surname : ' + groupLog[0].student.surname);
            //get the list of weeks that have entries added in the db
            const weekList = await contribution.getWeeksForStudentGroup(req.session.user.username, students);

            // const termWeeks = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24];

            const totalCont = await contribution.getTotalContribution(req.session.user.username, students);
            const groupAvgCont = await contribution.getGroupAvgCont(req.session.user.username, students);
            
            return res.render('portal/student/groupLog.hbs', {
                page: 'Student Portal',
                groupLog: groupLog,
                weekList: weekList,
                selectedWeek: selectedWeek,
                user: req.session.user,
                termWeeks: weeks,
                totalCont: totalCont,
                groupAvgCont: groupAvgCont,
                backButton: '/portal/student',
                homeButton: '/portal/student',
            });
        } catch (err) {
            console.log(err);
            return err;
        }
    });

    router.post('/', async (req, res, next) => {
        try {
            const selectedWeek = req.body.selectedWeek;
            return res.redirect('/portal/student/groupLog/' + selectedWeek);
            // let groupLog
            // console.log('selecte week is: ' + selectedWeek);
            // //check if all weeks (0) selected, or a specific week
            // if(selectedWeek == 0){
            //     //get all contribution logs for the group ordered by week
            //     console.log('about to call contribution for whole grouplog');
            //     groupLog = await contribution.getGroupContribution(req.session.user.username, students);
            //     console.log('got it : ' + groupLog);
            // } else {
            //     //get all logs for contribution of the selected week
            //     console.log('about to call contribution for grouplog');
            //     groupLog = await contribution.getGroupWeeklyContribution(req.session.user.username, selectedWeek, students);
            //     console.log('got it : ' + groupLog);
            // }
            //
            // // console.log('got it surname : ' + groupLog[0].student.surname);
            // //get the list of weeks that have entries added in the db
            // const weekList = await contribution.getWeeks();
            // // const termWeeks = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24];
            //
            // const totalCont = await contribution.getTotalContribution(req.session.user.username, students);
            // const groupAvgCont = await contribution.getGroupAvgCont(req.session.user.username, students);
            //
            // return res.render('portal/student/groupLog.hbs', {
            //     page: 'Student Portal',
            //     groupLog: groupLog,
            //     weekList: weekList,
            //     user: req.session.user,
            //     termWeeks: weeks,
            //     totalCont: totalCont,
            //     groupAvgCont: groupAvgCont,
            //     backButton: '/portal/student',
            //     homeButton: '/portal/student',
            // });
        } catch (err) {
            console.log(err);
            return err;
        }
    });

    router.post('/addCont', async (req, res, next) => {
        try {
            console.log('got into update');
            const contHours = req.body.contHours.trim();
            const contTasks = req.body.contTasks.trim();
            const selectedWeek = req.body.selectedWeek;


            if(!contHours || !contTasks || !selectedWeek) {
            // //get the list of weeks that have entries added in the db
            // const weekList = await contribution.getWeeks();
            // // const termWeeks = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24];
            //
            // const totalCont = await contribution.getTotalContribution(req.session.user.username, students);
            // const groupAvgCont = await contribution.getGroupAvgCont(req.session.user.username, students);
            //initially start on showing contribution for week 1
            //     const weekNo = 1;
            //     //get the contribution for the group the current student is in
            //     const groupLog = await contribution.getGroupWeeklyContribution(req.session.user.username, weekNo, students);
            //     // console.log('got it surname : ' + groupLog[0].student.surname);
            //     //get the list of weeks that have entries added in the db
            //     weekList = await contribution.getWeeks();
            //
            //     const termWeeks = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24];
            //
            //     const totalCont = await contribution.getTotalContribution(req.session.user.username, students);
            //     const groupAvgCont = await contribution.getGroupAvgCont(req.session.user.username, students);
            //
            //     return res.render('portal/student/groupLog.hbs', {
            //         page: 'Student Portal',
            //         groupLog: groupLog,
            //         weekList: weekList,
            //         user: req.session.user,
            //         termWeeks: termWeeks,
            //         totalCont: totalCont,
            //         groupAvgCont: groupAvgCont,
            //         backButton: '/portal/student',
            //         homeButton: '/portal/student',
            //     });
                return res.redirect('/portal/student/groupLog?success=false');
            }
            
            console.log('adding new contribution for student:' + req.session.user.username);
            await contribution.addEntry(contHours, contTasks, selectedWeek, req.session.user.username, students);
            console.log('repopulate contribution for grouplog');
            const groupLog = await contribution.getGroupWeeklyContribution(req.session.user.username, selectedWeek, students);
            console.log('got it revised  : ' + groupLog);
            return res.redirect('/portal/student/groupLog?success=true');

        } catch (err) {
            console.log(err);
            return err;
        }
    });

    router.post('/edit/:sid',  async (req, res, next) =>{
        try{
            const student = req.body.student;
            const hours = req.body.contHours;
            const tasks = req.body.contTasks;
            const selectedWeek = req.body.selectedWeek;
            await contribution.updateEntry(hours, tasks, selectedWeek, student, students);
            return res.redirect('/portal/student/groupLog?success=true');
        }catch (err) {
            console.log(err);
            return err;
        }

    })

    router.post('/delete/:sid',  async (req, res, next) =>{
        try{
            const sid = req.params.sid;
            const selectedWeek = req.body.selectedWeek;
            await contribution.deleteEntry(sid, selectedWeek);
            return res.redirect('/portal/student/groupLog?success=true');
        }catch (err) {
            console.log(err);
            return err;
        }

    })
    
    return router;
};
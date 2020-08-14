const express = require('express');

const router = express.Router();

const courseworkRoute = require('./coursework');
const toolsRoute = require('./tools');
// const filesRoute = require('./files');
const groupLogRoute = require('./groupLog');
const organiseMeetingsRoute = require('./organiseMeetings');
const briefRoute = require('./brief');

module.exports = (param) => {

    const { students, projectGroups, moduleLeaders, contribution, studentsSQL } = param;

    // Student home page - group details
    router.get('/', async (req, res, next) => {
        try {
            const promises = [];
            promises.push(students.getStudentGroupDetails(req.session.user.username, projectGroups, students));
            promises.push(students.getStudentsGMembers(req.session.user.username, students, projectGroups));
            promises.push(students.getGroupSupervisor(req.session.user.username, students, projectGroups));
            promises.push(students.getGroupClient(req.session.user.username, students, projectGroups));
            promises.push(moduleLeaders.getNames());
            const results = await Promise.all(promises);
            return res.render('portal/student.hbs', {
                page: 'Student Portal',
                user: req.session.user,
                groupMembers: results[1],
                details: results[0],
                supervisor: results[2],
                client: results[3],
                moduleLeader: results[4],
                backButton: '/portal/student',
                homeButton: '/portal/student',
            });
        } catch (err) {
            return err;
        }
    });

    router.use('/coursework', courseworkRoute(param));
    router.use('/tools', toolsRoute(param));
    // router.use('/files', filesRoute(param));
    router.use('/groupLog', groupLogRoute(param));
    router.use('/organiseMeetings', organiseMeetingsRoute(param));
    router.use('/brief', briefRoute(param));

    return router;
};
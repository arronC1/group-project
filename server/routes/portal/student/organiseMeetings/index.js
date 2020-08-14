const express = require('express');

const router = express.Router();

module.exports = (param) => {

    const { students, projectGroups, contribution, studentsSQL } = param;

    // Student organise meetings
    router.get('/', async (req, res, next) => {
        try {
            return res.render('portal/student/organiseMeetings.hbs', {
                page: 'Student Portal',
                user: req.session.user,
                backButton: '/portal/student',
                homeButton: '/portal/student',
            });
        } catch (err) {
            return err;
        }
    });

    return router;
};
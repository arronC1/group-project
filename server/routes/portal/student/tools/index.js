const express = require('express');

const router = express.Router();

module.exports = (param) => {

    const { students, projectGroups, contribution, studentsSQL } = param;

    // Student tools overview (index)
    router.get('/', async (req, res, next) => {
        try {
            return res.render('portal/student/tools.hbs', {
                page: 'Student Portal',
                user: req.session.user,
                backButton: '/portal/student',
                homeButton: '/portal/student',
            });
        } catch (err) {
            return err;
        }
    });
    // Student tools IDE
    router.get('/ide', async (req, res, next) => {
        try {
            return res.render('portal/student/tools/ide.hbs', {
                page: 'Student Portal',
                user: req.session.user,
                backButton: '/portal/student',
                homeButton: '/portal/student',
            });
        } catch (err) {
            return err;
        }
    });
    // Student tools UML
    router.get('/uml', async (req, res, next) => {
        try {
            return res.render('portal/student/tools/uml.hbs', {
                page: 'Student Portal',
                user: req.session.user,
                backButton: '/portal/student',
                homeButton: '/portal/student',
            });
        } catch (err) {
            return err;
        }
    });
    // Student tools task manager
    router.get('/taskManager', async (req, res, next) => {
        try {
            return res.render('portal/student/tools/taskManager.hbs', {
                page: 'Student Portal',
                user: req.session.user,
                backButton: '/portal/student',
                homeButton: '/portal/student',
            });
        } catch (err) {
            return err;
        }
    });
    // Student tools version control
    router.get('/versionControl', async (req, res, next) => {
        try {
            return res.render('portal/student/tools/versionControl.hbs', {
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
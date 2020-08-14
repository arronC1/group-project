const express = require('express');

const router = express.Router();

module.exports = (param) => {

    const { students, projectGroups, projectProposals, studentsSQL } = param;

    // Student brief
    router.get('/', async (req, res, next) => {

        const projectProposal = await projectProposals.getStudentsProposal(req.session.user.username, projectGroups, students);

        try {
            return res.render('portal/student/brief.hbs', {
                page: 'Student Brief',
                proposal: projectProposal,
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
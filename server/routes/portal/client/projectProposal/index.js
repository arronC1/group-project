const express = require('express');

const router = express.Router();

module.exports = (param) => {

    const { projects, projectProposals } = param;

    // Create new proposal
    router.post('/create', async (req, res, next) => {
        try {
            const proposalBrief = req.body.brief.trim();
            const projectID =  req.session.projectID;
            // Need to add error checking
            /*
            if(!sfirstname || !ssurname || !sstudentNumber) {
                return res.render('students/add.hbs', {
                    page: 'addStudents',
                    error: true,
                    sfirstname, ssurname, sstudentNumber, semail,
                    studentslist,
                    nav_ml: true // remove this when user.role is setup
                });
            }
            */
            const promises = [];
            // can hard-code this, newly submitted proposals will be 'pending review'
            promises.push(projects.setStatus(projectID, 'P'));
            promises.push(projectProposals.create(projectID, proposalBrief));
            await Promise.all(promises);
            return res.redirect('/portal/client/projects/show/' + projectID);
        } catch (err) {
            return next(err);
        }

    });

    return router;
};
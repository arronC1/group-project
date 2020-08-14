const express = require('express');

const router = express.Router();

module.exports = (param) => {

    const { projects, projectProposals, proposalReviews, moduleLeaders } = param;

    // Review proposal
    router.post('/review', async (req, res, next) => {
        try {
            const comment = req.body.comment.trim();
            const status = req.body.status.trim();
            const projectID =  req.session.projectID;
            // Need to lookup these keys before doing anything else (the way we've done users is not good)
            const moduleLeader = await moduleLeaders.getByEmail(req.session.user.username);
            const currentProposal = await projectProposals.getCurrentProposal(projectID);
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
            promises.push(projects.setStatus(projectID, status));
            promises.push(proposalReviews.create(currentProposal.id, moduleLeader.id, comment));
            await Promise.all(promises);
            return res.redirect('/portal/moduleLeader/projects/show/' + projectID);
        } catch (err) {
            return next(err);
        }

    });

    return router;
};
const express = require('express');

const router = express.Router();

module.exports = (param) => {

    const { projects, clients, projectProposals } = param;

    // Project list
    router.get('/list', async (req, res, next) => {
        try {
            const client = await clients.getByEmail(req.session.user.username);
            const promises = [];
            promises.push(projects.getList(client.id));
            promises.push(clients.getList());
            const results = await Promise.all(promises);
            res.render('portal/client/projects/list.hbs', {
                projectsList: results[0],
                clientList: results[1],
                user: req.session.user,
                backButton: '/portal/client',
                homeButton: '/portal/client',
            });
        } catch(err) {
            return next(err);
        }
    });


    // View project details
    router.get('/show/:projectID', async (req, res, next) => {
        try {
            var projectID = req.params.projectID;
            const promises = [];
            promises.push(projects.getDetails(projectID));
            promises.push(projectProposals.getCurrentProposal(projectID));
            promises.push(projectProposals.getProposalHistory(projectID));
            const results = await Promise.all(promises);
            const projectDeets = results[0];
            console.log("Project details:" + projectDeets.toJSON());
            // Store the projectID in the session
            req.session.projectID = projectID;
            res.render('portal/client/projects/detail.hbs', {
                projectDetails: results[0],
                currentProposal: results[1],
                proposalHistory: results[2],
                user: req.session.user,
                backButton: '/portal/client/projects/list',
                homeButton: '/portal/client',
            });
        } catch(err) {
            return next(err);
        }
    });

    return router;
};
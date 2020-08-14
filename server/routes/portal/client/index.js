const express = require('express');

const router = express.Router();

const projectsRoute = require('./projects');
const projectProposalRoute = require('./projectProposal');
const groupsRoute = require('./groups');

module.exports = (param) => {

    const { students, projectGroups, moduleLeaders,clients, projects } = param;

    // client home page
    router.get('/', async(req, res, next) => {
        try {
            const promises = [];
            promises.push(moduleLeaders.getNames());
            promises.push(clients.getGroupsFromUsername(req.session.user.username));
            promises.push(projects.getClientsProjects(req.session.user.username, clients));

            const results = await Promise.all(promises);
            return res.render('portal/client.hbs', {
                page: 'Client Portal',
                user: req.session.user,
                moduleLeader: results[0],
                group: results[1],
                project: results[2],
                backButton: '/portal/client',
                homeButton: '/portal/client',
            });
        } catch (err) {
            return err;
        }
    });

    router.use('/projects', projectsRoute(param));
    router.use('/projectProposal', projectProposalRoute(param));
    router.use('/groups', groupsRoute(param));


    return router;
};
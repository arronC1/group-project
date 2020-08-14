const express = require('express');

const router = express.Router();

const assignmentsRoute = require('./assignments');
const clientsRoute = require('./clients');
const groupsRoute = require('./groups');
const moduleLeadersRoute = require('./moduleLeaders');
const projectsRoute = require('./projects');
const projectProposalRoute = require('./projectProposal');
const studentsRoute = require('./students');
const supervisorsRoute = require('./supervisors');


module.exports = (param) => {

    const { supervisors, clients, projects, studentsSQL } = param;

    // Student brief
    router.get('/', async(req, res, next) => {
        try {
            const promises = [];
            promises.push(supervisors.getList());
            promises.push(clients.getList());
            promises.push(projects.getAll());

            const results = await Promise.all(promises);
            return res.render('portal/moduleLeader.hbs', {
                page: 'Module Leader Portal',
                user: req.session.user,
                supervisor: results[0],
                client: results[1],
                project: results[2],
                backButton: '/portal/moduleLeader',
                homeButton: '/portal/moduleLeader',
            });
        } catch (err) {
            return err;
        }
    });

    router.use('/assignments', assignmentsRoute(param));
    router.use('/clients', clientsRoute(param));
    router.use('/groups', groupsRoute(param));
    router.use('/moduleLeaders', moduleLeadersRoute(param));
    router.use('/projects', projectsRoute(param));
    router.use('/projectProposal', projectProposalRoute(param));
    router.use('/students', studentsRoute(param));
    router.use('/supervisors', supervisorsRoute(param));

    return router;
};
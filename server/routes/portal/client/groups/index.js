const express = require('express');

const router = express.Router();

module.exports = (param) => {

    const { clients, projectGroups, contribution, studentsSQL } = param;

    // clients groups list
    router.get('/', async(req, res, next) => {
        try {
            const promises = [];
            promises.push(clients.getGroupsFromUsername(req.session.user.username));
            const results = await Promise.all(promises);
            return res.render('portal/client/groups.hbs', {
                page: 'Client Portal',
                user: req.session.user,
                groups: results[0],
                backButton: '/portal/client',
                homeButton: '/portal/client',
            });
        } catch (err) {
            return err;
        }
    });

    // clients group details
    router.get('/detail/:gid', async(req, res, next) => {
        try {
            var gid = req.params.gid;
            const promises = [];
            promises.push(projectGroups.getGDetails(gid));
            promises.push(projectGroups.getMembers(gid));
            promises.push(projectGroups.getGSupervisor(gid));
            const results = await Promise.all(promises);
            return res.render('portal/client/groups/detail.hbs', {
                page: 'Client Portal',
                user: req.session.user,
                details: results[0],
                members: results[1],
                supervisor: results[2],
                backButton: '/portal/client/groups',
                homeButton: '/portal/client',
            });
        } catch (err) {
            return err;
        }
    });

    // clients group marking
    router.get('/marking/:gid', async(req, res, next) => {
        try {
            return res.render('portal/client/groups/marking.hbs', {
                page: 'Client Portal',
                user: req.session.user,
                backButton: '/portal/client',
                homeButton: '/portal/client',
            });
        } catch (err) {
            return err;
        }
    });



    return router;
};
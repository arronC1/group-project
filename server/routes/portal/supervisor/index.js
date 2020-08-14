const express = require('express');

const router = express.Router();

// const grouplogRoute = require('./grouplog');
const groupsRoute = require('./groups');

module.exports = (param) => {

    const { supervisors, moduleLeaders, contribution, studentsSQL } = param;

    // Supervisor home page
    router.get('/', async (req, res, next) => {
        try {
            const promises = [];
            promises.push(moduleLeaders.getNames());
            promises.push(supervisors.getGroupsFromUsername(req.session.user.username));

            const results = await Promise.all(promises);
            return res.render('portal/supervisor.hbs', {
                page: 'Supervisor Portal',
                user: req.session.user,
                moduleLeader: results[0],
                group: results[1],
                backButton: '/portal/supervisor',
                homeButton: '/portal/supervisor',
            });
        } catch (err) {
            return err;
        }
    });

    // router.use('/grouplog', grouplogRoute(param));
    router.use('/groups', groupsRoute(param));

    return router;
};
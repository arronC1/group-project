const express = require('express');

const router = express.Router();

module.exports = (param) => {

    const { moduleLeaders, moduleLeadersSQL } = param;

    //this is the route returned for the base of the students section - it renders the students page with parameters for the list of students in db
    // and a success code
    router.get('/', async (req, res, next) => {
        try {
            const leader = await moduleLeaders.getNames();
            console.log(JSON.stringify(leader));
            return res.render('portal/moduleLeader/moduleLeaders.hbs', {
                page: 'module-leader',
                leader,
                success: req.query.success,
                user: req.session.user,
                backButton: '/portal/moduleLeader',
                homeButton: '/portal/moduleLeader',
            });
        } catch(err) {
            return err;
        }
    });
    return router;
};
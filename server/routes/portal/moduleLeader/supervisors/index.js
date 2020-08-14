const express = require('express');

const router = express.Router();

module.exports = (param) => {

    const { supervisors } = param;

    router.get('/', async (req, res, next) => {
        try {
            const supervisorlist = await supervisors.getList();
            return res.render('portal/moduleLeader/supervisors.hbs', {
                page: 'Supervisor',
                supervisorlist,
                success: req.query.success,
                user: req.session.user,
                backButton: '/portal/moduleLeader',
                homeButton: '/portal/moduleLeader',
            });
        } catch(err) {
            return err;
        }
    });

    router.post('/add', async (req, res, next) => {
        try {
            const supfirstname = req.body.supfirstname.trim();
            const supsurname = req.body.supsurname.trim();
            const semail = await req.body.semail.trim();

            if(!supfirstname || !supsurname ) {
                return res.redirect('/portal/moduleLeader/supervisors?success=false');
            }
            
            await supervisors.addEntry(supfirstname, supsurname, semail);
            return res.redirect('/portal/moduleLeader/supervisors?success=true');
        } catch(err) {
            return next(err);
        }
        
    });

    router.post('/edit/:sid', async (req, res, next) => {
        try {
            const sid = req.params.sid;
            const supfirstname = req.body.supfirstname.trim();
            const supsurname = req.body.supsurname.trim();
            const semail = await req.body.semail.trim();
            if(!supfirstname || !supsurname ) {
                return res.redirect('/portal/moduleLeader/supervisors?success=false');
            }

            await supervisors.updateEntry(sid, supfirstname, supsurname, semail);
            return res.redirect('/portal/moduleLeader/supervisors?success=true');
        } catch(err) {
            return next(err);
        }

    });

    router.post('/delete/:sid', async (req, res, next) => {
        try {
            const sid = req.params.sid;
            await supervisors.deleteEntry(sid);
            return res.redirect('/portal/moduleLeader/supervisors?success=true');
        } catch(err) {
            return next(err);
        }

    });

    router.get('/detail/:sid', async (req, res, next) => {
        try {
            const sid = req.params.sid;
            const promises = [];
            promises.push(supervisors.getDetails(sid));
            promises.push(supervisors.getGroups(sid));
            promises.push(supervisors.getNoSupervisorGroups());
            const results = await Promise.all(promises);
            console.log('sup details' + results[0]);
            console.log('sup groups' + results[1]);
            console.log('no sup groups' + results[2]);
            res.render('portal/moduleLeader/supervisors/detail.hbs', {
                details: results[0][0].dataValues,
                groups: results[1],
                noGroups: results[2],
                success: req.query.success,
                user: req.session.user,
                backButton: '/portal/moduleLeader/supervisors',
                homeButton: '/portal/moduleLeader'
            });
        } catch(err) {
            return next(err);
            }
        });

    router.get('/:sid/addGroup/:gid', async (req, res, next) => {
        try {
            const sid = req.params.sid;
            const gid = req.params.gid;
            await supervisors.addGroup(sid, gid)
            const promises = [];
            promises.push(supervisors.getDetails(sid));
            promises.push(supervisors.getGroups(sid));
            promises.push(supervisors.getNoSupervisorGroups());
            const results = await Promise.all(promises);
            console.log('sup details' + results[0]);
            console.log('sup groups' + results[1]);
            console.log('no sup groups' + results[2]);
            res.render('portal/moduleLeader/supervisors/detail.hbs', {
                details: results[0][0].dataValues,
                groups: results[1],
                noGroups: results[2],
                success: req.query.success,
                user: req.session.user,
                backButton: '/portal/moduleLeader/supervisors',
                homeButton: '/portal/moduleLeader'
            });
        } catch(err) {
            return next(err);
        }
    });

    router.get('/:sid/removeGroup/:gid', async (req, res, next) => {
        try {
            const sid = req.params.sid;
            const gid = req.params.gid;
            await supervisors.removeGroup(gid)
            const promises = [];
            promises.push(supervisors.getDetails(sid));
            promises.push(supervisors.getGroups(sid));
            promises.push(supervisors.getNoSupervisorGroups());
            const results = await Promise.all(promises);
            console.log('sup details' + results[0]);
            console.log('sup groups' + results[1]);
            console.log('no sup groups' + results[2]);
            res.render('portal/moduleLeader/supervisors/detail.hbs', {
                details: results[0][0].dataValues,
                groups: results[1],
                noGroups: results[2],
                success: req.query.success,
                user: req.session.user,
                backButton: '/portal/moduleLeader/supervisors',
                homeButton: '/portal/moduleLeader'
            });
        } catch(err) {
            return next(err);
        }
    });

    return router;
};
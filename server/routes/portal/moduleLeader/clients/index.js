const express = require('express');

const router = express.Router();

module.exports = (param) => {

    const { clients, projectGroups, clientsSQL } = param;

    router.get('/', async (req, res, next) => {
        try {
            const clientlist = await clients.getList();
            return res.render('portal/moduleLeader/clients.hbs', {
                page: 'Client',
                clientlist,
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
            const cfirstname = req.body.clfirstname.trim();
            const csurename = req.body.clsurname.trim();
            const cemail = req.body.clemail.trim();

            if(!cfirstname || !csurename || !cemail ) {
                // const clientlist = await clients.getList();
                // return res.render('portal/moduleLeader/clients.hbs', {
                //     page: 'Client',
                //     clientlist,
                //     success: req.query.success,
                //     user: req.session.user,
                //     backButton: '/portal/moduleLeader',
                //     homeButton: '/portal/moduleLeader',
                // });
                return res.redirect('/portal/moduleLeader/clients?success=false');
            }
            
            await clients.addEntry(cfirstname, csurename, cemail);
            return res.redirect('/portal/moduleLeader/clients?success=true');
        } catch(err) {
            return next(err);
        }
        
    });


    router.post('/edit/:cid', async (req, res, next) => {
        try {
            const cid = req.params.cid;
            const cfirstname = req.body.clfirstname.trim();
            const csurename = req.body.clsurname.trim();
            const cemail = req.body.clemail.trim();

            if(!cfirstname || !csurename || !cemail ) {
                // const clientlist = await clients.getList();
                // return res.render('portal/moduleLeader/clients.hbs', {
                //     page: 'Client',
                //     clientlist,
                //     success: req.query.success,
                //     user: req.session.user,
                //     backButton: '/portal/moduleLeader',
                //     homeButton: '/portal/moduleLeader',
                // });
                return res.redirect('/portal/moduleLeader/clients?success=false');
            }

            await clients.updateEntry(cid, cfirstname, csurename, cemail);
            return res.redirect('/portal/moduleLeader/clients?success=true');
        } catch(err) {
            return next(err);
        }

    });

    router.post('/delete/:cid', async (req, res, next) => {
        try {
            const cid = req.params.cid;
            await clients.deleteEntry(cid);
            return res.redirect('/portal/moduleLeader/clients?success=true');
        } catch(err) {
            return next(err);
        }

    });

    router.get('/detail/:cid', async (req, res, next) => {
        try {
            const cid = req.params.cid;
            const promises = [];
            promises.push(clients.getDetails(cid));
            promises.push(clients.getGroups(cid));
            promises.push(clients.getNoClientGroups());
            const results = await Promise.all(promises);
            res.render('portal/moduleLeader/clients/detail.hbs', {
                details: results[0][0].dataValues,
                groups: results[1],
                noGroups: results[2],
                success: req.query.success,
                user: req.session.user,
                backButton: '/portal/moduleLeader/clients',
                homeButton: '/portal/moduleLeader',
            });
        } catch(err) {
            return next(err);
            }
        });

    return router;
};
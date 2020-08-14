const express = require('express');

const router = express.Router();

module.exports = (param) => {

    const { projectGroups, projectGroupsSQL, students, studentsSQL } = param;

    router.get('/', async (req, res, next) => {
        try {
            const grouplist = await projectGroups.getList();
            const ungrouped = await students.getUngroupedStudents();
            return res.render('portal/moduleLeader/groups.hbs', {
                page: 'Project Groups',
                grouplist,
                ungrouped,
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
            const pgName = req.body.pgName.trim();
            const pgDescription = req.body.pgDescription.trim();

            if(!pgName || !pgDescription) {
                return res.redirect('/portal/moduleLeader/groups?success=false');
            }
            
            await projectGroups.addEntry(pgName, pgDescription);
            return res.redirect('/portal/moduleLeader/groups?success=true');
        } catch(err) {
            return next(err);
        }
        
    });

    router.post('/edit/:gid', async (req, res, next) => {
        try {
            const gid = req.params.gid;
            const pgName = req.body.pgName.trim();
            const pgDescription = req.body.pgDescription.trim();

            if(!pgName || !pgDescription) {
                return res.redirect('/portal/moduleLeader/groups?success=false');
            }

            await projectGroups.updateEntry(gid, pgName, pgDescription);
            return res.redirect('/portal/moduleLeader/groups?success=true');
        } catch(err) {
            return next(err);
        }

    });

    router.post('/delete/:gid', async (req, res, next) => {
        try {
            const gid = req.params.gid;

            await projectGroups.deleteEntry(gid);
            return res.redirect('/portal/moduleLeader/groups?success=true');
        } catch(err) {
            return next(err);
        }

    });

    router.get('/detail/:gid', async (req, res, next) => {
        try {
            const gid = req.params.gid;
            const promises = [];
            promises.push(projectGroups.getGDetails(gid));
            promises.push(projectGroups.getMembers(gid));
            promises.push(projectGroups.getGSupervisor(gid));
            promises.push(projectGroups.getGClient(gid));
            const results = await Promise.all(promises);
            res.render('portal/moduleLeader/groups/detail.hbs', {
                details: results[0],
                members: results[1],
                supervisor: results[2],
                client: results[3],
                success: req.query.success,
                user: req.session.user,
                backButton: '/portal/moduleLeader/groups',
                homeButton: '/portal/moduleLeader',
            });
        } catch(err) {
            return next(err);
            }
        });

    router.post('/form', async (req, res, next) => {
        try {
            const nog = Number(req.body.noOfGroups);
            let groups = [];

            for (let i = 1; i <=nog; ++i) {
                let g = await projectGroups.addEntry("Group" + i, "Auto Group " + i);
                groups.push(g.dataValues.id);
            }
            const ungrouped = await students.getUngroupedStudents();

            let nogcounter = 0;

            for (let i = 0; i < ungrouped.length; i++) {
                if (nogcounter >= nog) {
                    nogcounter = 0;
                }
                await students.setGID(ungrouped[i].id, groups[nogcounter]);
                nogcounter = nogcounter + 1;
            }
            return res.redirect('/portal/moduleLeader/groups?success=true')
        } catch(err) {
            return next(err);
        }
    });

    return router;
};
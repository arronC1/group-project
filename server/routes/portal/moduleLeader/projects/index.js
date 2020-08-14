const express = require('express');

const router = express.Router();

module.exports = (param) => {

    const { projects, clients, projectProposals, projectGroups } = param;

    // Project list
    router.get('/list', async (req, res, next) => {
        try {
            const promises = [];
            promises.push(projects.getAll());
            promises.push(clients.getList());
            const results = await Promise.all(promises);
            res.render('portal/moduleLeader/projects/list.hbs', {
                projectsList: results[0],
                clientList: results[1],
                user: req.session.user,
                backButton: '/portal/moduleLeader',
                homeButton: '/portal/moduleLeader',
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
            promises.push(projectGroups.getAllByProjectID(projectID));
            promises.push(projectGroups.getAllWithoutProject(projectID));
            const results = await Promise.all(promises);
            // Store the projectID in the session
            req.session.projectID = projectID;
            res.render('portal/moduleLeader/projects/detail.hbs', {
                projectDetails: results[0],
                currentProposal: results[1],
                proposalHistory: results[2],
                projectGroups: results[3],
                groupsToAdd: results[4],
                user: req.session.user,
                backButton: '/portal/moduleLeader/projects/list',
                homeButton: '/portal/moduleLeader',
            });
        } catch(err) {
            return next(err);
        }
    });

    // Create new project
    router.post('/create', async (req, res, next) => {
        try {
            const projectName = req.body.name.trim();
            const clientID = req.body.client.trim();

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
            
            await projects.create(projectName, clientID);
            return res.redirect('/portal/moduleLeader/projects/list');
        } catch(err) {
            return next(err);
        }
        
    });

    router.post('/:projectID/assigntogroup', async (req, res, next) => {
        try {
            const projectID = req.params.projectID;
            const groupID = req.body.group.trim();
            await projectGroups.setProjectID(groupID, projectID);
            return res.redirect('/portal/moduleLeader/projects/show/' + projectID);
        } catch(err) {
            return next(err);
        }
    });

    return router;
};
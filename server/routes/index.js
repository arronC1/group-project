/////////////////////////////////////////////////////////////////////////////////////
//////////////////////// MVC Controller & Web Routes Config /////////////////////////

// Import downloaded packages from node_modules 
const express = require('express');

// create router object/instance from the express webserver
const router = express.Router();

// Import routes into variables for use below - this doesn't do anything yet
const dashboardRoute = require('./dashboard');
// const studentsRoute = require('./students');
// const clientsRoute = require('./clients');
// const moduleLeadersRoute = require('./moduleLeaders');
// const projectGroupsRoute = require('./groups');
const loginRoute = require('./login');
// const supervisorRoute = require('./supervisors');
// const assignmentRoute = require('./assignments');
const portalRoute = require('./portal');
// const projectRoute = require('./project');
// const projectProposalRoute = require('./projectProposal');
const messagesRoute = require('./messages');
// when another JS file does a require() on this file it gets returned the module.exports
// treat this as the public definition of methods and variables that the JS file is importing
module.exports = (param) => {

    // extract variables from parameter list
    //const {  } = param;
    // middleware function to check for logged-in users
    console.log("2");
    var sessionChecker = (req, res, next) => {
        console.log("2.1");
        if (req.session.user && req.cookies.user_sid) {
            console.log("2.2");
            next();
        } else {
            console.log("2.3");
            res.redirect('/dashboard');
        }   
    };

    // middleware function to check if user authorized to view page
    var authorizationChecker = function (authorized) {
        return function (req, res, next) {
            if (authorized.includes(req.session.user.user_type)) {
                next();
            } else {
                return res.send('Not authorized to view this page');
                // ^ need to handle this properly
            }
        }
    };

    router.get('/', sessionChecker, (req, res, next) => {
        console.log("2.2");
        //if there is a user logged in and they go to root/home of site, check user type and redirect to correct portal
        if (req.session.user.user_type === 'MLE') {
            console.log("6.6.1");
            return res.redirect('/portal/moduleLeader');
        }
        else if (req.session.user.user_type === 'SUP') {
            console.log("6.6.2");
            return res.redirect('/portal/supervisor');
        }
        else if (req.session.user.user_type === 'STU') {
            console.log("6.6.3");
            return res.redirect('/portal/student');
        } else if (req.session.user.user_type === 'CLI') {
            console.log("6.6.4");
            return res.redirect('/portal/client');
        } else {
            //can't identify user type so return to dashboard
            return res.redirect('/dashboard');
        }
    });


    // load in more Controller routes from sub-directories

    // Add routes that don't require authorization here:
    router.use('/login', loginRoute(param, sessionChecker)); // Session checker only needed for change password
    router.use('/dashboard', dashboardRoute(param));

    // Routes that do require authentication:
    router.use(sessionChecker); 
    // ^ This means we don't have to define/pass the sessionChecker function in/to each route file,
    // it will be applied to all routes defined below it:
    // router.use('/students', studentsRoute(param));
    // router.use('/clients', clientsRoute(param));
    // router.use('/module_leader', authorizationChecker(["MLE"]), moduleLeadersRoute(param));
    /* 
        ^ Example of guarding all routes i.e. this will guard all /module_leader/*
        routes so that only module leaders can access these. Pass a list of user types 
        who can access the routes. 
    */
    // router.use('/groups', projectGroupsRoute(param));
    // router.use('/supervisors', supervisorRoute(param));
    router.use('/portal', portalRoute(param, authorizationChecker));
    /* 
        ^ Example of passing middleware to be used within route i.e.
        can't restrict /portal/* as different routes have different access 
        - only students should be able to access /portal/student 
        and only clients should be able to access /portal/client so this needs to be 
        handled on a per-route basis
    */
    // router.use('/projects', projectRoute(param));
    // router.use('/project-proposals', projectProposalRoute(param));
    // TODO should messages check for user permissions
    router.use('/messages', messagesRoute(param));
    // router.use('/assignments', assignmentRoute(param));
    // returns router object so the line in our main JS file
    //      const routes = require('./routes');
    // results in the routes variable being assigned the router object we created here
    return router;
};
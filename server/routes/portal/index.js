const express = require('express');

const router = express.Router();

const studentRoute = require('./student');
const moduleLeaderRoute = require('./moduleLeader');
const clientRoute = require('./client');
const supervisorRoute = require('./supervisor');

module.exports = (param, authorizationChecker) => {

    // const { students, projectGroups, contribution, studentsSQL } = param;

    router.get('/', (req, res, next) => {
        return res.redirect('/dashboard');
    });

    router.use('/student', authorizationChecker(["STU"]), studentRoute(param));
    router.use('/moduleLeader', authorizationChecker(["MLE"]), moduleLeaderRoute(param));
    router.use('/client', authorizationChecker(["CLI"]), clientRoute(param));
    router.use('/supervisor', authorizationChecker(["SUP"]), supervisorRoute(param));

    return router;
};
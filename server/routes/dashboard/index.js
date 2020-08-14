const express = require('express');

const router = express.Router();

module.exports = (param) => {

    // extract variables from parameter list
    const { students, projectGroups, supervisors } = param;

    // this is processed if the browser requests the root/top level of our website using a GET request
    // it either returns plain HTML (i,e. MVC View) or it generates an error and passes error to the next() function
    router.get('/', async (req, res, next) => {
        try {
            // think of promises as threads performing async activities
            // array of functions is created
            // const promises = [];
            // promises.push(students.getNames());
            const groups = await projectGroups.getNames();
            // promises.push(supervisors.getNames());
            // Promise.all effectively waits for all promises in the array to complete and stores results from each in results array
            // effectively allows getListShort() & getAllArtwork() to run in parallel
            // const results = await Promise.all(promises);
    
            // return MVC View as response
            // this is rendered HTML using the detail.hbs template combined with the list of data supplied
            // as this returns a response and next() isn't called all processing stops here
            return res.render('index.hbs', {
                page: 'Home',
                groupNames: groups,
                // studentNames: results[0],
                // groupNames: results[1],
                // supervisorNames: results[2],
                user: req.session.user
            });
        } catch(err) {
            // as an error has occurred the next() function is called with an err parameter - effectively this will only match functions that have (err,req, res, next)
            // next() has a number of overloaded method signatures with different numbers of parameters
            return next(err);
        }
    });

    return router;
}
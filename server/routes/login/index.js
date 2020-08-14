const express = require('express');
const jwt = require('jwt-simple');
const nodemailer = require('nodemailer');

const router = express.Router();

module.exports = (param, sessionChecker) => {

    const { users, students, moduleLeaders, clients, supervisors} = param;

    console.log("4");

    router.get('/', async (req, res, next) => {
        console.log("5");
        try {
            return res.render('login.hbs', {
                page: 'Login'
            });
        } catch(err) {
            return err;
        }
    });

    router.post('/', async (req, res, next) => {
        var username = req.body.lusername,
            password = req.body.lpassword;
        try {
            const user = await users.login(username, password);
            req.session.user = user.dataValues;
            return res.redirect('/');
        }
        // User not found or password incorrect
        catch(err) {
            // TO DO: send message to user
            res.redirect('/login');
        }
    });

    router.get('/signup', async (req, res, next) => {
        console.log("7");
        try {
            return res.render('login/signup.hbs', {
                page: 'Signup'
            });
        } catch(err) {
            return err;
        }
    });

    router.post('/signup', async (req, res, next) => {
        console.log("8");
        var lusername = req.body.lusername,
            lpassword = req.body.lpassword;
        console.log("username = " + lusername);
        console.log("password = " + lpassword);
        console.log("8.1");
        users.addEntry(lusername, lpassword, 'hint', students, moduleLeaders, clients, supervisors)
        .then(user => {
            console.log("8.2");
            req.session.user = user.dataValues;
            res.redirect('/dashboard');
        })
        .catch(error => {
            console.log("8.3");
            console.error("Error: " + error);
            res.redirect('/login/signup');
        });
    });

    router.get('/logout', async (req, res, next) => {
        console.log("9");
        if (req.session.user && req.cookies.user_sid) {
            res.clearCookie('user_sid');
            res.redirect('/');
        } else {
            res.redirect('/login');
        }
    });

    // for when we implement the login functionality
   // router.post('/', async (req, res, next) => {


   // Password reset functionality based on guide here: https://www.smashingmagazine.com/2017/11/safe-password-resets-with-json-web-tokens/
   // Accessed: 26/02/2019
    router.post('/passwordreset', function (req, res) {
        if (req.body.email !== undefined) {
            var email = req.body.email;

            users.getUser(email).then(function (user) {
                var payload = {
                    id: user.id,  
                    email: email,
                    nbf: (Date.now() / 1000), // Token will be valid as soon as it is issued
                    exp: ((Date.now() / 1000) + 1800) // Token will expire after 30 mins (1800 seconds)
                };
                var secret = user.password + '-' + user.createdAt.getTime();
                // By basing token secrent on user password hash, it will invalidate the token when password is changed
                var token = jwt.encode(payload, secret);

                // Send email with reset link
                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                      user: 'project.central.email@gmail.com',
                      pass: 'dHcMpwdEB5JzWUA'
                    },
                    tls: {
                        rejectUnauthorized: false
                    }
                  });
                  
                  var mailOptions = {
                    from: 'Project Central <project.central.email@gmail.com>',
                    to: email,
                    subject: 'Project Central | Password Reset',
                    html: '<a href="http://localhost:3000/login/resetpassword/' + payload.id + '/' + token + '">Reset password</a>'
                  };
                  
                  transporter.sendMail(mailOptions, function(error, info){
                    res.redirect('/');
                    if (error) {
                      console.log(error);
                      // Display message to user
                    } else {
                      console.log('Email sent: ' + info.response);
                      // Display message to user
                    }
                  });
            })
            .catch(error => {
                console.log(error);
                res.redirect('/'); // re-direct to login for now
            });
        } else {
            //Handle any issues (user not found)
        }
    });


    router.get('/resetpassword/:id/:token', function(req, res) {
        users.getUserByID(req.params.id).then(function (user) {
            var secret = user.password + '-' + user.createdAt.getTime();
            var payload = jwt.decode(req.params.token, secret);
            var email = user.username;
            var id = payload.id;
            var token = req.params.token;
            res.render('login/resetPassword.hbs', {
                email,
                id,
                token
            });
        })
        .catch(error => {
            console.log(error);
            res.redirect('/'); // re-direct to login for now
        });
    
        // TODO: Handle decoding issues and token expiry

    });

    router.post('/resetpassword', function(req, res) {
        users.getUserByID(req.body.id).then(function (user) {
            var secret = user.password + '-' + user.createdAt.getTime();
            jwt.decode(req.body.token, secret);
            var password = req.body.password;
            user.update({password: password});
            res.redirect('/');
            // Let user know password was successfully updated
            // Sign user in automatically?
        })
        .catch(error => {
            console.log(error);
            res.redirect('/'); // re-direct to login for now
        });
        // TODO: Handle decoding issues and token expiry
    });

    router.post('/changepassword', sessionChecker, async (req, res, next) => {
       try {
            var userID = req.session.user.id;
            var currentPass = req.body.currentPass;
            var newPass = req.body.newPass;
            var confPass = req.body.confPass;
            const user = await users.getUserByID(userID);
            var errors = [];
            if (!user.validPassword(currentPass)) {
                errors.push('Current password is invalid');
            }
            if (newPass !== confPass) {
                errors.push('New password does not match confirmation');
            }
            if (!errors.length) {
                await users.setPassword(user, newPass);
                return res.json({success : 'Password sucessfully changed'});
            }
            else {
                return res.json({errors: errors});
            }
        }
        catch(err) {
            return next(err);
        }
    });

    return router;
};
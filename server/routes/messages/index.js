const express = require('express');

const router = express.Router();

module.exports = (param) => {

    const {messages, messagesSQL, users, usersSQL} = param;

    //this is the route returned for the base of the students section - it renders the students page with parameters for the list of students in db
    // and a success code
    router.get('/', async (req, res, next) => {
        try {
            const uID = req.session.user.id;
            const userList = await users.getList();
            const messageList = await messages.getMessages(uID);
            return res.render('messages.hbs', {
                page: 'messages',
                uID,
                userList,
                messageList,
                success: req.query.success,
                user: req.session.user
            });
        } catch(err) {
            return err;
        }
    });

    router.post('/', async (req, res, next) => {
        try {
            const mmessageTitle = req.body.mmessageTitle.trim();
            const mmessageContent = req.body.mmessageContent.trim();
            const sourceUserID = req.session.user.id;
            const destinationID = req.body.userid;
            await messages.addEntry(mmessageTitle, mmessageContent, sourceUserID, destinationID);
            return res.redirect('/messages');
        } catch(err) {
            return next(err);
            }
    });

    router.get('/detail/:mid', async (req, res, next) => {
        try {
            var mid = req.params.mid;
            const message = await messages.getDetail(mid);
            res.render('messages/detail.hbs', {
                message: message,
                success: req.query.success,
                user: req.session.user
            });
        } catch(err) {
            return next(err);
            }
        });
    return router;
};
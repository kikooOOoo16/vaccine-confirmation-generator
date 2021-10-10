const express = require('express');
const {checkIfValidQueryFields, transformQueryFields} = require('../utils/shared');
const User = require('../models/user');
const passport = require('passport');
const {handleLoginErrors} = require('../utils/shared');

const router = express.Router();

const flashMessageOptions = {
    position:"t",
    duration:"3000"
};

router.get('', async (req, res, next) => {
    try {
        const allowedQueryParams = ['name', 'surname', 'vaccine', 'date', 'id'];
        const reqQueryParams = Object.keys(req.query);
        await checkIfValidQueryFields(reqQueryParams, allowedQueryParams);
        await transformQueryFields(req.query);

        res.render('index', {...req.query})
    } catch (err) {
        res.status(400).json({
            message: err
        })
    }
});

// USER REGISTRATION GET

router.get('/register', (req, res, next) => {
    res.render('auth/register');
});

// USER REGISTRATION POST

router.post('/register', async (req, res, next) => {
    const user = new User({
        username: req.body.username
    });
    try {
        const resUser = await User.register(user, req.body.password);
        passport.authenticate('local', {
            successRedirect: '/patients',
            failureRedirect: '/register'
        })(req, res, () => {
            res.flash(`Successfully registered! Welcome ${resUser.username}`, 'success', flashMessageOptions);
            res.redirect('/patients');
        });
    } catch (err) {
        res.flash(`Error: ${err}`, 'error', flashMessageOptions);
        res.redirect('/register');
    }
});

// USER LOGIN GET

router.get('/login', (req, res, next) => {
    res.render('auth/login')
});

// USER LOGIN POST

router.post('/login', (req, res, next) => {
    passport.authenticate('local', async (err, user, info) => {
        await handleLoginErrors(err, user, info, res);
        console.log(`err: ${err}`);
        console.log(`user ${user}`);
        console.log(`info ${info}`);
    })(req, res, next);
});

module.exports = router;
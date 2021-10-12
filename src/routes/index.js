const express = require('express');
const User = require('../models/user');
const passport = require('passport');
const Patient = require('../models/patient');

const router = express.Router();

// GET PATIENT CERTIFICATE CONFIRMATION
router.get('/Covid19VaccineCertificates/:id', async (req, res, next) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) {
            res.status(404).json({
                message: 'Patient data not found.'
            });
        }
        res.render('index', {patient})
    } catch (err) {
        // res.status(400).json({
        //     message: 'Не е пронајден валиден сертификат'
        // });
        res.send('<p>Не е пронајден валиден сертификат</p>');
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
            req.flash('success', `Successfully registered! Welcome ${resUser.username}`);
            res.redirect('/patients');
        });
    } catch (err) {
        req.flash('error', `Error: ${err}`);
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
        if (err) {
            req.flash('error', `Error: ${err}`);
            return res.redirect('/login');
        }
        if (!user) {
            if (info) {
                req.flash('warning', `Error: ${info}`);
            }
            return res.redirect('/login');
        }
        req.login(user, (err) => {
            if (err) {
                req.flash('error', `Error: ${err}`);
                res.redirect('/login');
            }
            req.flash('success', `Logged in successfully, welcome ${user.username}!`);
            res.redirect('/patients');
        })
    })(req, res, next);
});

// USER LOGOUT GET
router.get('/logout', (req, res, next) => {
    req.logout();
    req.flash('success', 'Logged you out!');
    res.redirect('/login');
});

module.exports = router;
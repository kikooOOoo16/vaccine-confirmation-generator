const Patient = require('../models/patient');
const User = require('../models/user');

const logger = require('../utils/logger');

const passport = require('passport');

exports.getPatientCertificate = async (req, res, next) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) {
            res.status(404).json({
                message: 'Patient data not found.'
            });
        }
        await logger.saveLog(patient.name, patient.surname);
        res.render('index', {patient})
    } catch (err) {
        res.send('<p>Не е пронајден валиден сертификат</p>');
    }
};

exports.getRegisterUser = (req, res, next) => {
    res.render('auth/register');
};

exports.postRegisterUser = async (req, res, next) => {
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
};

exports.getLoginUser = (req, res, next) => {
    res.render('auth/login')
};

exports.postLoginUser = (req, res, next) => {
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
            res.redirect('/patients/?currentPage=1&pageSize=10');
        })
    })(req, res, next);
};

exports.getLogoutUser = (req, res, next) => {
    req.logout();
    req.flash('success', 'Logged you out!');
    res.redirect('/login');
};
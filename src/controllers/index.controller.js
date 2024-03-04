const Patient = require('../models/patient');
const User = require('../models/user');

const userActionsLogger = require('../utils/user-actions-logger');

const passport = require('passport');
const {join} = require('path');
const fs = require('fs');
const logger = require('../logger/logger');
const path = require('path');
const pdfsDirectory = path.join(__dirname, '../db/certificates');

exports.getPatientCertificate = async (req, res) => {
    const patientID = req.params.id;
    logger.info(`INDEX CONTROLLER | GET patient certificate confirmation called for id ${patientID}`);
    try {
        const patient = await Patient.findById(patientID);
        if (!patient) {
            res.status(404).json({
                message: 'Patient data not found.',
            });
        }
        await userActionsLogger.saveLog(patient.name, patient.surname);
        res.render('index', {patient});
    } catch (err) {
        logger.warn(`INDEX CONTROLLER | GET patient certificate confirmation failed for id ${patientID}, ${err}`);
        res.send('<p>Не е пронајден валиден сертификат</p>');
    }
};

exports.getPatientCertificatePdf = (req, res) => {
    const patientID = req.params.id;

    logger.info(`INDEX CONTROLLER | GET patient certificate file called for id ${patientID}`);

    const filePath = join(pdfsDirectory, patientID + '.pdf');

    // Check if the file exists
    if (fs.existsSync(filePath)) {
        // Stream the file to the client
        const stream = fs.createReadStream(filePath);
        stream.pipe(res);
    } else {
        // File not found
        logger.error(
            `INDEX CONTROLLER | Problem retrieving patient certificate file for id ${patientID}. Not found in path "${filePath}".`
        );
        req.flash('error', `No certificate file found for patient ID: ${patientID}`);
        res.redirect('/patients?currentPage=1&pageSize=10');
    }
};

exports.getRegisterUser = (req, res) => {
    logger.info('INDEX CONTROLLER | GET register user page called');
    res.render('auth/register');
};

exports.postRegisterUser = async (req, res) => {
    logger.info('INDEX CONTROLLER | POST register user called');
    const user = new User({
        username: req.body.username,
    });
    try {
        const resUser = await User.register(user, req.body.password);
        passport.authenticate('local', {
            successRedirect: '/patients',
            failureRedirect: '/register',
        })(req, res, () => {
            req.flash('success', `Successfully registered! Welcome ${resUser.username}`);
            res.redirect('/patients?currentPage=1&pageSize=10');
        });
    } catch (err) {
        logger.error(`INDEX CONTROLLER | Problem registering new user ${err}`);
        req.flash('error', `Error: ${err}`);
        res.redirect('/register');
    }
};

exports.getLoginUser = (req, res) => {
    logger.info('INDEX CONTROLLER | GET login user page called');
    res.render('auth/login');
};

exports.postLoginUser = (req, res, next) => {
    logger.info('INDEX CONTROLLER | POST login user called');
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
        req.login(user, err => {
            if (err) {
                logger.error(`INDEX CONTROLLER | Problem logging in user ${err}`);
                req.flash('error', `Error: ${err}`);
                res.redirect('/login');
            }
            req.flash('success', `Logged in successfully, welcome ${user.username}!`);
            res.redirect('/patients/?currentPage=1&pageSize=10');
        });
    })(req, res, next);
};

exports.getLogoutUser = (req, res) => {
    logger.info('INDEX CONTROLLER | GET logout user called');
    req.logout(function (err) {
        if (err) {
            logger.error(`Problem logging you out: ${err}`);
            req.flash('error', `Error: ${err}`);
            res.redirect('/patients/?currentPage=1&pageSize=10');
        } else {
            req.flash('success', 'Logged you out!');
            res.redirect('/login');
        }
    });
};

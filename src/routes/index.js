const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/middleware');

const indexControllers = require('../controllers/index.controller');

// GET PATIENT CERTIFICATE CONFIRMATION
router.get('/Covid19VaccineCertificates/:id', indexControllers.getPatientCertificate);

// GET PATIENT CERTIFICATE PDF FILE
router.get('/Covid19VaccineCertificates/pdf/:id', authMiddleware, indexControllers.getPatientCertificatePdf);

// USER REGISTRATION GET
router.get('/register', indexControllers.getRegisterUser);

// USER REGISTRATION POST
router.post('/register', indexControllers.postRegisterUser);

// USER LOGIN GET
router.get('/login', indexControllers.getLoginUser);

// USER LOGIN POST
router.post('/login', indexControllers.postLoginUser);

// USER LOGOUT GET
router.get('/logout', authMiddleware, indexControllers.getLogoutUser);

module.exports = router;

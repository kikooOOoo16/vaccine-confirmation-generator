const express = require('express');
const authMiddleware = require('../middleware/middleware');
const Patient = require('../models/patient');
const moment = require('moment');

const router = express.Router();

// GET ALL PATIENTS
router.get('/', authMiddleware, async (req, res, next) => {
    const patients = await Patient.find({}).sort({name: 'asc', surname: '1'});
    res.render('patients/index', { patients, page: 'all-patients' });
});

// GET NEW PATIENT FORM
router.get('/new', authMiddleware, (req, res, next) => {
    res.render('patients/new', {page: 'new-patient'});
});

// POST NEW PATIENT TO DB
router.post('/new', authMiddleware, async (req, res, next) => {
    const patient = new Patient({
        ...req.body
    });
    console.log(moment(req.body.application_date).format('DD.MM.YYYY'));
    patient.application_date = moment(req.body.application_date).format('DD.MM.YYYY');

    try {
        await patient.save();
        req.flash('success', 'New patient added successfully!');
        res.redirect('/patients');
    } catch  (err) {
        req.flash('error', `Error: ${err}`);
        res.redirect('/patients/new');
    }
});

// GET EDIT PATIENT ROUTE
router.get('/:id/edit', authMiddleware, async (req, res, next) => {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
        req.flash('error', `There was a problem finding that specific data!`);
        res.redirect('/patients');
    }
    res.render('patients/edit', {patient, page: ''});
});

// PATCH SINGLE PATIENT DATA
router.patch('/:id', authMiddleware, async (req, res, next) => {
    req.body.application_date = moment(req.body.application_date).format('DD.MM.YYYY');
    const reqUpdateFields = Object.keys(req.body);

    try {
        const newPatient = await Patient.findOne({_id: req.params.id});

        if (!newPatient) {
            throw `There was a problem retrieving the patient's data!`;
        }

        reqUpdateFields.forEach(updateField => {
            newPatient[updateField] = req.body[updateField];
        });

        await newPatient.save();

        req.flash('success', 'Patient data successfully updated!');
        res.redirect('/patients');
    } catch (err) {
        req.flash('error', `Error: ${err}!`);
        res.redirect('/patients');
    }
});

// DELETE SINGLE PATIENT DATA
router.delete('/:id', authMiddleware, async (req, res, next) => {
    try {
        const deletedPatient = await Patient.findOneAndDelete({_id: req.params.id});

        if (!deletedPatient) {
            req.flash('error', `There was a problem deleting the patient's data.`);
            res.redirect('/patients');
        }
        req.flash('success', 'Patient data successfully deleted!');
        res.redirect('/patients');
    } catch (err) {
        req.flash('error', `Error: ${err}!`);
        res.redirect('/patients');
    }
});

module.exports = router;
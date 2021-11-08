const Patient = require('../models/patient');
const moment = require('moment');


exports.getAllPatients = async (req, res, next) => {
    try {
        const pageSize = +req.query.pageSize;
        const currentPage = +req.query.currentPage;
        let patientsQuery = Patient.find({}).sort({name: 'asc', surname: '1'});

        const numOfPatients = await Patient.countDocuments().exec();

        if (req.query.currentPage && req.query.pageSize > 0) {
            patientsQuery
                .skip((currentPage - 1) * pageSize)
                .limit(pageSize)
        }
        patientsQuery.then(patients => {
            res.render('patients/index', {
                patients,
                page: 'all-patients',
                pages: Math.ceil(numOfPatients / pageSize),
                currentPage
            });
        })
    } catch (err) {
        req.flash('error', `Error: ${err}`);
        res.render('patients/index', {
            patients: [],
            page: 'all-patients',
            pages: 0,
            currentPage: 0
        });
    }
};

exports.getNewPatient = (req, res, next) => {
    res.render('patients/new', {page: 'new-patient'});
};

exports.postNewPatient = async (req, res, next) => {
    const patient = new Patient({
        ...req.body
    });
    patient.application_date = moment(req.body.application_date).format('DD.MM.YYYY');

    try {
        await patient.save();
        req.flash('success', 'New patient added successfully!');
        res.redirect('/patients/?currentPage=1&pageSize=10');
    } catch  (err) {
        req.flash('error', `Error: ${err}`);
        res.redirect('/patients/new');
    }
};

exports.getEditPatient = async (req, res, next) => {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
        req.flash('error', `There was a problem finding that specific data!`);
        res.redirect('/patients/?currentPage=1&pageSize=10');
    }
    res.render('patients/edit', {patient, page: ''});
};

exports.patchSinglePatient = async (req, res, next) => {
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
        res.redirect('/patients/?currentPage=1&pageSize=10');
    } catch (err) {
        req.flash('error', `Error: ${err}!`);
        res.redirect('/patients/?currentPage=1&pageSize=10');
    }
};

exports.deleteSinglePatient = async (req, res, next) => {
    try {
        const deletedPatient = await Patient.findOneAndDelete({_id: req.params.id});

        if (!deletedPatient) {
            req.flash('error', `There was a problem deleting the patient's data.`);
            res.redirect('/patients/?currentPage=1&pageSize=10');
        }
        req.flash('success', 'Patient data successfully deleted!');
        res.redirect('/patients/?currentPage=1&pageSize=10');
    } catch (err) {
        req.flash('error', `Error: ${err}!`);
        res.redirect('/patients/?currentPage=1&pageSize=10');
    }
};
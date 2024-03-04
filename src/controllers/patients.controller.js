const Patient = require('../models/patient');
const moment = require('moment');
const logger = require('../logger/logger');

exports.getAllPatients = async (req, res) => {
    try {
        const pageSize = +req.query.pageSize;
        const currentPage = +req.query.currentPage;
        let patientsQuery = Patient.find({}).collation({locale: 'mk', strength: 2}).sort({name: 'asc', surname: 'asc'});

        logger.info(
            `PATIENTS_CONTROLLER | GET all patients request received. ${JSON.stringify({pageSize, currentPage})}`
        );

        const numOfPatients = await Patient.countDocuments().exec();

        if (req.query.currentPage && req.query.pageSize > 0) {
            patientsQuery = patientsQuery.skip((currentPage - 1) * pageSize).limit(pageSize);
        }

        patientsQuery.then(patients => {
            res.render('patients/index', {
                patients,
                page: 'all-patients',
                pages: Math.ceil(numOfPatients / pageSize),
                currentPage,
                pageSize,
            });
        });
    } catch (err) {
        logger.error(`PATIENTS_CONTROLLER | Problem retrieving all patients data: ${err}`);
        req.flash('error', `Error: ${err}`);
        res.render('patients/index', {
            patients: [],
            page: 'all-patients',
            pages: 0,
            currentPage: 0,
        });
    }
};

exports.getNewPatient = (req, res) => {
    logger.info(`PATIENTS_CONTROLLER | GET new patient page called.`);
    res.render('patients/new', {page: 'new-patient'});
};

exports.postNewPatient = async (req, res) => {
    logger.info(`PATIENTS_CONTROLLER | POST new patient called.`);
    const passed = validateVaccineDataInput(req, res, 'new');

    if (!passed) {
        return;
    }

    const patient = new Patient({
        ...req.body,
    });

    if (patient.application_date !== 'null') {
        patient.application_date = moment(req.body.application_date).format('DD.MM.YYYY');
    }

    logger.debug(`PATIENTS_CONTROLLER | POST new patient request body: ${JSON.stringify(req.body, null, 2)}.`);

    try {
        await patient.save();
        req.flash('success', 'New patient added successfully!');
        res.redirect('/patients/?currentPage=1&pageSize=10');
    } catch (err) {
        logger.error(`PATIENTS_CONTROLLER | Problem creating new patient: ${err}`);
        req.flash('error', `Error: ${err}`);
        res.redirect('/patients/new');
    }
};

exports.getPatientStatistics = async (req, res) => {
    logger.info(`PATIENTS_CONTROLLER | GET Patient statistics page called.`);

    try {
        const vaccinationStatusPerCityData = await Patient.aggregate([
            {
                $group: {
                    _id: {city: '$city'},
                    vaccinated: {
                        $sum: {
                            $cond: [{$ne: ['$vaccine', 'null']}, 1, 0],
                        },
                    },
                    unvaccinated: {
                        $sum: {
                            $cond: [{$eq: ['$vaccine', 'null']}, 1, 0],
                        },
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    city: '$_id.city',
                    vaccinated: 1,
                    unvaccinated: 1,
                },
            },
        ]);

        logger.debug(`Vaccination status per city retrieved: ${JSON.stringify(vaccinationStatusPerCityData, null, 2)}`);

        res.render('patients/statistics', {
            vaccinationStatusPerCityData,
            page: 'statistics',
        });
    } catch (err) {
        logger.error(`Problem retrieving patients statistics data: ${err}`);
        req.flash('error', `Error: ${err}!`);
        res.redirect('/patients/?currentPage=1&pageSize=10');
    }
};

exports.getEditPatient = async (req, res) => {
    logger.info(`PATIENTS_CONTROLLER | GET Edit existing patient page called for ID ${req.params.id}.`);
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
        logger.error(`PATIENTS_CONTROLLER | Problem retrieving patient data for edit.`);
        req.flash('error', `There was a problem finding that specific data!`);
        res.redirect('/patients/?currentPage=1&pageSize=10');
    }
    res.render('patients/edit', {patient, page: ''});
};

exports.patchSinglePatient = async (req, res) => {
    logger.info(`PATIENTS_CONTROLLER | PATCH single patient called for ID ${req.params.id}`);
    logger.debug(`PATIENTS_CONTROLLER | PATCH req body = ${JSON.stringify(req.body, null, 2)}.`);
    const passed = validateVaccineDataInput(req, res, 'edit');

    if (!passed) {
        return;
    }

    if (req.body.application_date !== 'null') {
        logger.debug('PATIENTS_CONTROLLER | PATCH application_date is not null so format date time is triggered');
        req.body.application_date = moment(req.body.application_date).format('DD.MM.YYYY');
    }

    const reqUpdateFields = Object.keys(req.body);

    logger.debug(`PATIENTS_CONTROLLER | PATCH reqUpdateFields = ${JSON.stringify(reqUpdateFields, null, 2)}.`);
    logger.debug(`PATIENTS_CONTROLLER | PATCH req body status = ${JSON.stringify(req.body, null, 2)}.`);

    try {
        const newPatient = await Patient.findOne({_id: req.params.id});

        if (!newPatient) {
            logger.error(`PATIENTS_CONTROLLER | Problem retrieving patient data for edit.`);
            throw `There was a problem retrieving the patient's data!`;
        }

        reqUpdateFields.forEach(updateField => {
            newPatient[updateField] = req.body[updateField];
        });

        await newPatient.save();

        req.flash('success', 'Patient data successfully updated!');
        res.redirect('/patients/?currentPage=1&pageSize=10');
    } catch (err) {
        logger.error(`PATIENTS_CONTROLLER | Problem updating patient data: ${err}`);
        req.flash('error', `Error: ${err}!`);
        res.redirect('/patients/?currentPage=1&pageSize=10');
    }
};

exports.deleteSinglePatient = async (req, res) => {
    logger.info(`PATIENTS_CONTROLLER | DELETE single patient called for ID ${req.params.id}`);
    try {
        const deletedPatient = await Patient.findOneAndDelete({_id: req.params.id});

        if (!deletedPatient) {
            req.flash('error', `There was a problem deleting the patient's data.`);
            res.redirect('/patients/?currentPage=1&pageSize=10');
        }
        req.flash('success', 'Patient data successfully deleted!');
        res.redirect('/patients/?currentPage=1&pageSize=10');
    } catch (err) {
        logger.error(`PATIENTS_CONTROLLER | Problem updating patient data: ${err}`);
        req.flash('error', `Error: ${err}!`);
        res.redirect('/patients/?currentPage=1&pageSize=10');
    }
};

function validateVaccineDataInput(req, res, action) {
    if (
        !(req.body.vaccine && req.body.certificate_code && req.body.application_date) &&
        !(req.body.vaccine || req.body.certificate_code || req.body.application_date)
    ) {
        req.body = {
            ...req.body,
            vaccine: 'null',
            certificate_code: 'null',
            application_date: 'null',
        };

        return true;
    } else if (!(req.body.vaccine && req.body.certificate_code && req.body.application_date)) {
        logger.error(
            `PATIENTS_CONTROLLER | Problem executing ${action} patient: If vaccination data is entered, all values must be present.`
        );
        req.flash('error', `Error: If vaccination data is entered, all values must be present.`);
        action === 'edit' ? res.redirect('/patients/?currentPage=1&pageSize=10') : res.redirect(`/patients/${action}`);
        return false;
    }
}

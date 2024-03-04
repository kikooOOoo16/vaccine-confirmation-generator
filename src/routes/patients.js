const express = require('express');
const authMiddleware = require('../middleware/middleware');
const patientsControllers = require('../controllers/patients.controller');

const router = express.Router();

// GET ALL PATIENTS
router.get('/', authMiddleware, patientsControllers.getAllPatients);

// GET NEW PATIENT FORM
router.get('/new', authMiddleware, patientsControllers.getNewPatient);

// POST NEW PATIENT TO DB
router.post('/new', authMiddleware, patientsControllers.postNewPatient);

// GET PATIENT STATISTICS
router.get('/statistics', authMiddleware, patientsControllers.getPatientStatistics);

// GET EDIT PATIENT ROUTE
router.get('/:id/edit', authMiddleware, patientsControllers.getEditPatient);

// PATCH SINGLE PATIENT DATA
router.patch('/:id', authMiddleware, patientsControllers.patchSinglePatient);

// DELETE SINGLE PATIENT DATA
router.delete('/:id', authMiddleware, patientsControllers.deleteSinglePatient);

module.exports = router;

const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    surname: {
        type: String,
        required: true,
        trim: true
    },
    vaccine: {
        type: String,
        required: true,
        trim: true
    },
    application_date: {
        type: String,
        required: true
    },
    certificate_code: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if (value.length !== 28) {
                throw new Error('Certificate code must be ')
            }
        }
    }
});

module.exports = mongoose.model('Patient', patientSchema);
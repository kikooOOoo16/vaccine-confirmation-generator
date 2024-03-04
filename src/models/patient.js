const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    surname: {
        type: String,
        required: true,
        trim: true,
    },
    city: {
        type: String,
        required: true,
        trim: true,
    },
    vaccine: {
        type: String,
        required: false,
        trim: true,
    },
    application_date: {
        type: String,
        required: false,
    },
    certificate_code: {
        type: String,
        required: false,
        trim: true,
        validate(value) {
            if (value !== 'null' && value?.length !== 28) {
                throw new Error('Certificate code must be longer than 28 characters!');
            }
        },
    },
});

module.exports = mongoose.model('Patient', patientSchema);

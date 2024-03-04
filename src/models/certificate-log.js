const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
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
    request_date: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Log', logSchema);
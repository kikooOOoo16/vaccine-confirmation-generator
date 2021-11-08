const Log = require('../models/certificateLog');
const moment = require('moment');

exports.saveLog = async (name, surname) => {
    try {
        const editedName = name.split('/')[0].trim();
        const editedSurname = surname.split('/')[0].trim();
        const request_date = moment().format('MMMM Do YYYY, HH:mm:ss')
        const newLog = new Log({
            name: editedName,
            surname: editedSurname,
            request_date
        });
        await newLog.save();
    } catch (e) {
        console.log(e);
    }
}
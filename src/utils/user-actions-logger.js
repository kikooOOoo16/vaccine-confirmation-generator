const Log = require('../models/certificate-log');
const moment = require('moment');
const logger = require('../logger/logger');

exports.saveLog = async (name, surname) => {
    try {
        const editedName = name.split('/')[0].trim();
        const editedSurname = surname.split('/')[0].trim();
        const request_date = moment().format('MMMM Do YYYY, HH:mm:ss');
        const newLog = new Log({
            name: editedName,
            surname: editedSurname,
            request_date,
        });
        await newLog.save();
        logger.info(`Logged new user action for user "${name} ${surname}"`);
    } catch (e) {
        logger.error(e);
    }
};

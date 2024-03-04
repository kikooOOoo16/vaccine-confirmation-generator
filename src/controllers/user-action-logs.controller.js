const CertificateLog = require('../models/certificate-log');
const logger = require('../logger/logger');

exports.getLogs = async (req, res) => {
    logger.info('USER ACTION LOGS | GET user logs called');
    try {
        const pageSize = +req.query.pageSize;
        const currentPage = +req.query.currentPage;
        const logsQuery = CertificateLog.find({});

        const numOfLogs = await CertificateLog.countDocuments().exec();

        if (req.query.currentPage && req.query.pageSize > 0) {
            logsQuery.skip((currentPage - 1) * pageSize).limit(pageSize);
        }

        logsQuery.then(logs => {
            res.render('logs/index', {
                logs,
                page: 'logs',
                pages: Math.ceil(numOfLogs / pageSize),
                currentPage,
            });
        });
    } catch (err) {
        logger.error(`USER ACTION LOGS | Problem retrieving user logs ${err}`);
        req.flash('error', `Error: ${err}`);
        res.redirect('/patients/?currentPage=1&pageSize=10');
    }
};

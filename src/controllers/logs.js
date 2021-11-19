const CertificateLog = require('../models/certificateLog');

exports.getLogs = async (req, res, next) => {
    try {
        const pageSize = +req.query.pageSize;
        const currentPage = +req.query.currentPage;
        const logsQuery = CertificateLog.find({});

        const numOfLogs = await CertificateLog.countDocuments().exec();

        if (req.query.currentPage && req.query.pageSize > 0) {
            logsQuery
                .skip((currentPage - 1) * pageSize)
                .limit(pageSize)
        }

        logsQuery.then(logs => {
            res.render('logs/index', {
                logs,
                page: 'logs',
                pages: Math.ceil(numOfLogs / pageSize),
                currentPage
            });
        });
    } catch (err) {
        req.flash('error', `Error: ${err}`);
        res.redirect('/patients/?currentPage=1&pageSize=10');
    }
}
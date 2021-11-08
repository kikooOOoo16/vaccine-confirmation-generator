const CertificateLog = require('../models/certificateLog');

exports.getLogs = async (req, res, next) => {
    try {
        const logs = await CertificateLog.find({});
        res.render('logs/index', {
            logs,
            page: 'logs'
        });
    } catch (err) {
        req.flash('error', `Error: ${err}`);
        res.redirect('/patients/?currentPage=1&pageSize=10');
    }
}
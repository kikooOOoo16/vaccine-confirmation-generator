const logger = require('../logger/logger');
const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    logger.error(`AUTH MIDDLEWARE | Authentication failed for path ${req?.path}`);
    req.flash('error', `You don't have permission to do that.`);
    res.redirect('/login');
};

module.exports = isLoggedIn;

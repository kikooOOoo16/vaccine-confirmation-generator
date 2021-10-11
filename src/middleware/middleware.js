isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error', `You don't have permission to do that.`);
    res.redirect('/login');
}

module.exports = isLoggedIn;
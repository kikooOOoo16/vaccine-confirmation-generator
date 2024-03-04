const expressSession = require('express-session');
const passport = require('passport');
const User = require('../src/models/user');
const passportLocalStrategy = require('passport-local');

const setupPassport = app => {
    app.use(
        expressSession({
            secret: process.env.PASSPORT_SECRET,
            resave: false,
            saveUninitialized: false,
        })
    );

    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(new passportLocalStrategy(User.authenticate()));
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());
};

module.exports = setupPassport;

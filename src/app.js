const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const passportSetup = require('../config/passport');
const flash = require('connect-flash');
const methodOverride = require('method-override');

const indexRoutes = require('./routes/index');
const patientsRoutes = require('./routes/patients');
const loggerRoutes = require('./routes/user-action-logs');

// Connect to DB
require('./db/mongoose');

const app = express();

// Setup flash-express for flash messages
app.use(flash());

// Setup method override in order to send PATCH and DELETE requests as query params (client doesn't support them we can only send POST and GET)
app.use(methodOverride('_method'));

// Setup passport local strategy
passportSetup(app);

// Middleware that passes data to all templates
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    res.locals.warning = req.flash('warning');
    next();
});

// setup body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// setup view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/public/views'));

// expose static content
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/db/certificates'));

// setup routes
app.use('/', indexRoutes);
app.use('/patients', patientsRoutes);
app.use('/logs', loggerRoutes);

// every other route handling
app.get('/*', (req, res, next) => {
    // res.redirect('https://vakcinacija.mk/');
});

module.exports = app;

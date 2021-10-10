const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const passportSetup = require('../config/passport');
const flash = require('flash-express');

const indexRoutes = require('./routes/index');
const patientsRoutes = require('./routes/patients');

// Connect to DB
require('./db/mongoose');

const app = express();

// Setup flash-express for flash messages
app.use(flash());

// Setup passport local strategy
passportSetup(app);

// Middleware that passes data to all templates
app.use ( (req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});

// setup body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// setup view engine
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, '/public/views'));

// expose static content
app.use(express.static(__dirname + "/public"));

// setup routes
app.use('/', indexRoutes);
app.use('/patients', patientsRoutes);

module.exports = app;

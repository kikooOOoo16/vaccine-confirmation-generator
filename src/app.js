const express = require('express');
const bodyParser = require('body-parser');
const indexRoutes = require('./routes');
const path = require('path');

const app = express();

// setup body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// setup view engine
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, '/public/views'));

// expose static content
app.use(express.static(__dirname + "/public"));

// setup routes
app.use('/', indexRoutes)

module.exports = app;

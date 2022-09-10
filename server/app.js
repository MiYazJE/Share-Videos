const express = require('express');
const passport = require('passport');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();

const apiRoutes = require('./app/routes/routes');

require('./app/lib/passport');

const app = express();
app.use(cors());

app.use(morgan('tiny'));
app.use(express.json());

app.use('/', apiRoutes);

passport.initialize();
passport.use(passport.session());

module.exports = app;

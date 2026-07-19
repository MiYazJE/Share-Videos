const express = require('express');
const passport = require('passport');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();

const apiRoutes = require('./app/routes/routes');
const errorHandler = require('./app/middlewares/errorHandler');
const readiness = require('./lib/readiness');

require('./app/lib/passport');

const app = express();
app.use(cors());

app.use(morgan('tiny'));
app.use(express.json());

app.get('/health', (req, res) => {
  if (!readiness.isReady()) {
    return res.status(503).json({ status: 'unready' });
  }

  return res.json({ status: 'ready' });
});

app.use('/', apiRoutes);
app.use(errorHandler);

passport.initialize();
passport.use(passport.session());

module.exports = app;

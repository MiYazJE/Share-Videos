const path = require('path');
const express = require('express');
const app = express();

require('dotenv').config();

app.use(require('morgan')('tiny'));

app.use(express.json());
app.use('/', require('./app/routes/routes.js'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log('MAGIC at port ' + PORT));
const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const app = express();

require('dotenv').config();

const isDev = process.env.ENVIROMENT === 'development';

app.use(require('morgan')('tiny'));
app.use(express.json());
app.use('/api/v1/', require('./app/routes/routes.js'));
if (!isDev) {
    app.use(express.static(path.resolve(__dirname, 'client/build')))
    app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'client/build', 'index.html')));
}

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log('MAGIC at port ' + PORT));
const io = socketIO(server, { path: '/socket-io' });
require('./lib/socketIo')(io);

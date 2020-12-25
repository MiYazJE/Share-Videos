const path         = require('path');
const express      = require('express');
const socketIO     = require('socket.io');
const passport     = require('passport');
const cookieParser = require('cookie-parser');
const session      = require('express-session');
const app          = express();

const isDev = process.env.ENVIROMENT !== 'production';

initServer();

function initServer() {
    require('dotenv').config();
    app.use(require('morgan')('tiny'));
    
    app.use(express.json());
    app.use(session({ saveUninitialized: true, resave: false, secret: process.env.SECRET_KEY }));
    app.use(cookieParser());

    initRoutes();
    initPassport();

    const PORT = process.env.PORT || 5000;
    const server = app.listen(PORT, () => console.log('MAGIC at port ' + PORT));
    const io = socketIO(server, { path: '/socket-io' });
    const roomsCtrl = require('./lib/socketIo')(io);
    app.locals.roomsCtrl = roomsCtrl;
}

function initRoutes() {
    app.use('/api/v1/', require('./app/routes/routes.js'));
    if (!isDev) {
        app.use(express.static(path.resolve(__dirname, 'client/build')))
        app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'client/build', 'index.html')));
    }
}

function initPassport() {
    require('./app/lib/passport');
    passport.initialize();
    passport.use(passport.session());
}
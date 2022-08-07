const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const morgan = require('morgan');
const cors = require('cors');
const { initializeMongoDB } = require('./database/connect');
const initRoomsCtrl = require('./lib/socketIo');
const apiRoutes = require('./app/routes/routes');
require('dotenv').config();
require('./app/lib/passport');

const app = express();
app.use(cors());

const isDev = process.env.ENVIROMENT !== 'production';

function useRoutes() {
  app.use('/api/v1/', apiRoutes);
  if (!isDev) {
    app.use(express.static(path.resolve(__dirname, 'client/build')));
    app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'client/build', 'index.html')));
  }
}

function initPassport() {
  passport.initialize();
  passport.use(passport.session());
}

function initServer() {
  app.use(morgan('tiny'));
  app.use(express.json());
  app.use(session({ saveUninitialized: true, resave: false, secret: process.env.SECRET_KEY }));
  app.use(cookieParser());

  initializeMongoDB();
  useRoutes();
  initPassport();

  const PORT = process.env.PORT || 3000;
  const server = app.listen(PORT, () => console.log(`MAGIC at port ${PORT}`));
  const io = socketIO(server, { path: '/socket-io' });
  const roomsCtrl = initRoomsCtrl(io);
  app.locals.roomsCtrl = roomsCtrl;
}

initServer();

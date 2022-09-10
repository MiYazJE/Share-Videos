const socketIO = require('socket.io');

const app = require('./app');
const clientDb = require('./config/createDatabase');
const initRoomsCtrl = require('./lib/socketIo');
const config = require('./config/config');

async function main() {
  await clientDb.connect(); 

  const server = app.listen(config.appPort, () => console.log(`MAGIC at port ${config.appPort}`));

  const io = socketIO(server, { path: '/socket-io' });
  const roomsCtrl = initRoomsCtrl(io);
  app.locals.roomsCtrl = roomsCtrl;
}

main();

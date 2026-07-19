const socketIO = require('socket.io');

const app = require('./app');
const clientDb = require('./config/createDatabase');
const initRoomsCtrl = require('./lib/socketIo');
const config = require('./config/config');
const createLifecycle = require('./lib/lifecycle');
const readiness = require('./lib/readiness');

const logger = console;

async function main() {
  readiness.markUnready();
  await clientDb.connect();

  const server = app.listen(config.appPort, '0.0.0.0');
  const io = socketIO(server, { path: '/socket-io' });
  const roomsCtrl = initRoomsCtrl(io);
  app.locals.roomsCtrl = roomsCtrl;

  const lifecycle = createLifecycle({
    server,
    io,
    database: clientDb,
    readiness,
    shutdownTimeoutMs: config.shutdownTimeoutMs,
  });
  lifecycle.registerProcessHandlers();

  await new Promise((resolve, reject) => {
    server.once('listening', resolve);
    server.once('error', reject);
  });

  readiness.markReady();
  logger.log(`MAGIC at port ${config.appPort}`);

  return { server, io, lifecycle };
}

if (require.main === module) {
  main().catch((error) => {
    readiness.markUnready();
    logger.error('Server startup failed', error);
    process.exitCode = 1;
  });
}

module.exports = { main };

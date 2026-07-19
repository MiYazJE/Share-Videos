const { NOTIFY_MESSAGE } = require('./constants');

function socketHandler(event, socket, handler) {
  return (...args) => Promise.resolve()
    .then(() => handler(...args))
    .catch((error) => {
      console.error('Socket event failed', {
        event,
        socketId: socket.id,
        error,
      });

      if (socket.connected !== false) {
        socket.emit(NOTIFY_MESSAGE, {
          msg: 'The requested action could not be completed',
          variant: 'error',
        });
      }
    });
}

module.exports = socketHandler;

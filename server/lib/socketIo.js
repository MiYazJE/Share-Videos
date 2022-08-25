const {
  JOIN_ROOM,
  ADD_VIDEO,
  REMOVE_VIDEO,
  VIEW_VIDEO,
  SEND_PLAYER_STATE,
  SEND_PROGRESS,
  SEND_MESSAGE,
  REORDER_PLAYLIST,
  LEAVE_ROOM,
} = require('./constants');

const { roomsController } = require('./roomsController');

const REASONS = {
  CLIENT_DISCONNECTS: 'client namespace disconnect',
  TRANSPORT_CLOSE: 'transport close',
  CLIENT_LEAVE_ROOM: 'client room disconnected',
};

module.exports = (io) => {
  const roomsCtrl = roomsController(io);

  io.on('connection', (socket) => {
    socket.on(JOIN_ROOM, (payload) => roomsCtrl.join(payload, socket));
    socket.on(ADD_VIDEO, (payload) => roomsCtrl.addVideo(payload, socket));
    socket.on(REMOVE_VIDEO, (payload) => roomsCtrl.removeVideo(payload, socket));
    socket.on(SEND_PROGRESS, (payload) => roomsCtrl.sendProgress(payload, socket));
    socket.on(SEND_PLAYER_STATE, (payload) => roomsCtrl.sendPlayerState(payload, socket));
    socket.on(VIEW_VIDEO, roomsCtrl.viewVideo);
    socket.on(SEND_MESSAGE, roomsCtrl.sendMessage);
    socket.on(REORDER_PLAYLIST, roomsCtrl.reorderPlaylist);
    socket.on(LEAVE_ROOM, () => roomsCtrl.leaveRoom(REASONS.CLIENT_LEAVE_ROOM, socket));

    socket.on('disconnect', (reason) => {
      if (reason === REASONS.CLIENT_DISCONNECTS) {
        return;
      }

      if (reason !== REASONS.TRANSPORT_CLOSE) {
        socket.connect();
        return;
      }

      roomsCtrl.leaveRoom(reason, socket);
    });
  });

  return roomsCtrl;
};

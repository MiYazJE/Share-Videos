const {
  JOIN_ROOM,
  ADD_VIDEO,
  REMOVE_VIDEO,
  VIEW_VIDEO,
  SEND_PLAYER_STATE,
  SEND_PROGRESS,
  SEND_MESSAGE,
  REORDER_PLAYLIST,
} = require('./constants');
const { roomsController } = require('./roomsController');

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

    socket.on('disconnect', (reason) => roomsCtrl.leaveRoom(reason, socket));
  });

  return roomsCtrl;
};

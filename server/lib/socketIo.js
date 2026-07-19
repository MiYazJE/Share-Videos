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
const socketHandler = require('./socketHandler');

const CLIENT_LEAVE_REASON = 'client room disconnected';

module.exports = (io) => {
  const roomsCtrl = roomsController(io);

  io.on('connection', (socket) => {
    socket.on(JOIN_ROOM, socketHandler(JOIN_ROOM, socket, (payload) => roomsCtrl.join(payload, socket)));
    socket.on(ADD_VIDEO, socketHandler(ADD_VIDEO, socket, (payload) => roomsCtrl.addVideo(payload, socket)));
    socket.on(REMOVE_VIDEO, socketHandler(REMOVE_VIDEO, socket, (payload) => roomsCtrl.removeVideo(payload, socket)));
    socket.on(SEND_PROGRESS, socketHandler(SEND_PROGRESS, socket, (payload) => roomsCtrl.sendProgress(payload, socket)));
    socket.on(SEND_PLAYER_STATE, socketHandler(SEND_PLAYER_STATE, socket, (payload) => roomsCtrl.sendPlayerState(payload, socket)));
    socket.on(VIEW_VIDEO, socketHandler(VIEW_VIDEO, socket, roomsCtrl.viewVideo));
    socket.on(SEND_MESSAGE, socketHandler(SEND_MESSAGE, socket, roomsCtrl.sendMessage));
    socket.on(REORDER_PLAYLIST, socketHandler(REORDER_PLAYLIST, socket, roomsCtrl.reorderPlaylist));
    socket.on(LEAVE_ROOM, socketHandler(LEAVE_ROOM, socket, () => roomsCtrl.leaveRoom(CLIENT_LEAVE_REASON, socket)));
    socket.on('disconnect', socketHandler('disconnect', socket, (reason) => roomsCtrl.leaveRoom(reason, socket)));
  });

  return roomsCtrl;
};

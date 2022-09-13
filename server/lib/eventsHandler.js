function eventsHandler(io) {
  function joinRoom(socket, id) {
    socket.join(id);
  }

  function emitToRoom(socket, id, event, payload) {
    socket.to(id).emit(event, payload);
  }

  function broadcastToRoom(id, event, payload) {
    io.to(id).emit(event, payload);
  }

  function leaveRoom(socket, id) {
    socket.leave(id);
  }

  function emitToMe(socket, event, payload) {
    socket.emit(event, payload);
  }

  return {
    joinRoom,
    emitToRoom,
    broadcastToRoom,
    leaveRoom,
    emitToMe,
  };
}

module.exports = (io) => eventsHandler(io);

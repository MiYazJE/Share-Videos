const { 
    JOIN_ROOM, 
    ADD_VIDEO, 
    REMOVE_VIDEO, 
    VIEW_VIDEO, 
    SEND_PLAYER_STATE 
} = require('./constants.js');
const { roomsController } = require('./roomsController');

module.exports = io => {
    const roomsCtrl = roomsController(io);
    
    io.on('connection', socket => {
        socket.on(JOIN_ROOM, (payload) => roomsCtrl.join(payload, socket));
        socket.on(ADD_VIDEO,              roomsCtrl.addVideo);
        socket.on(REMOVE_VIDEO,           roomsCtrl.removeVideo);
        socket.on(VIEW_VIDEO,             roomsCtrl.viewVideo);
        socket.on(SEND_PLAYER_STATE,      roomsCtrl.sendPlayerState);
    });

    return roomsCtrl;
}
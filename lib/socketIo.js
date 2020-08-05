const { JOIN_ROOM, ADD_VIDEO } = require('./constants.js');
const { roomsController } = require('./roomsController');

module.exports = io => {
    const roomsCtrl = roomsController(io);
    
    io.on('connection', socket => {
        console.log('an user connected!');

        socket.on(JOIN_ROOM, (payload) => roomsCtrl.join(payload, socket));
        socket.on(ADD_VIDEO, roomsCtrl.addVideo);

    });

    return roomsCtrl;
}
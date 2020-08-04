const { roomsController } = require('./roomsController');

module.exports = io => {
    const roomsCtrl = roomsController(io);
    
    io.on('connection', socket => {
        console.log('an user connected!');

        socket.on('joinRoom', (payload) => roomsCtrl.join(payload, socket));

    });

    return roomsCtrl;
}
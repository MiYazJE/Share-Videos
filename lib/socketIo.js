const { roomsController } = require('./roomsController');

module.exports = io => {
    const rooms = roomsController(io);
    
    io.on('connection', socket => {
        console.log('an user connected!');

        socket.on('createRoom', rooms.create);
        socket.on('joinRoom', rooms.join);

    });

}
const { roomsController } = require('./roomsController');

module.exports = io => {

    io.on('connection', socket => {
        console.log('an user connected!');

        socket.on('createRoom', obj => {
            console.log(obj);
        });

    });

}
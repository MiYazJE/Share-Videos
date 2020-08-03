const { roomsController } = require('./roomsController');

module.exports = io => {

    io.on('connection', socket => {
        console.log('an user connected!');
    });

}
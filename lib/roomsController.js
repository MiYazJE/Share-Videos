module.exports = { roomsController };

function roomsController(io) {

    const rooms = new Map();

    return {
        create,
        join
    };

    function create({ nameCreator }) {
        const id = generateId();
        rooms.set(id, {
            id, 
            nameCreator,
            users: [],
        });
    }

    function generateId() {
        return (Date.now()
                .toString(36) + Math.random()
                .toString(36)
                .substr(2, 5))
                .toUpperCase();
    }
    
    function join(socket, id) {
        socket.join(id);
    }

}

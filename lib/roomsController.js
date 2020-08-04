module.exports = { roomsController };

function roomsController(io) {

    const rooms = new Map();

    return {
        create,
        join,
        get: (id) => rooms.get(id)
    };

    function create(host) {
        const id = generateId();
        const room = {
            id, 
            host,
            users: []
        }
        rooms.set(id, room);
        return room;
    }

    function generateId() {
        return (Date.now()
                .toString(36) + Math.random()
                .toString(36)
                .substr(2, 5))
                .toUpperCase();
    }
    
    function join(payload, socket) {
        console.log(payload);
        const room = rooms.get(payload.id);
        rooms.set(payload.id, {
            ...room,
            users: [...room.users, payload.name]
        });
        console.log(room);
        socket.join(payload.id);
    }

}

const { UPDATE_ROOM } = require("./constants");

module.exports = { roomsController };

function roomsController(io) {

    const rooms = new Map();

    return {
        create,
        join,
        addVideo,
        get: (id) => rooms.get(id)
    };

    function create(host) {
        const id = generateId();
        const room = {
            id, 
            host,
            users: new Set(),
            queue: [],
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
        const { id, name } = payload;
        const room = rooms.get(id);
        if (!room) return;

        room.users.add(name);
        rooms.set(id, room);

        socket.join(id);
        io.to(id).emit(UPDATE_ROOM, {
            ...room,
            users: Array.from(room.users.values())
        });
    }

    function addVideo({ video, id }) {
        console.log('adding video', video, id);
        const room = rooms.get(id);
        room.queue = [
            ...room.queue,
            { ...video, id: generateId() }
        ];
        console.log(room);
        rooms.set(id, room);
        io.to(id).emit(UPDATE_ROOM, { queue: room.queue });
    }

}

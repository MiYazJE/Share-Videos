const { 
    UPDATE_ROOM, 
    VIEW_VIDEO, 
    SEND_PLAYER_STATE 
} = require("./constants");

module.exports = { roomsController };

const INITIAL_URL_VIDEO = 'https://www.youtube.com/watch?v=Tct7AfFaR1o';

function roomsController(io) {

    const rooms = new Map();

    return {
        create,
        join,
        addVideo,
        removeVideo,
        viewVideo,
        sendPlayerState,
        get: (id) => rooms.get(id)
    };

    function create(host) {
        const id = generateId();
        const room = {
            id, 
            host,
            users: new Set(),
            queue: [],
            urlVideo: INITIAL_URL_VIDEO
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
            users: mapUsers(room.users)
        });
    }

    function mapUsers(users) {
        return Array.from(users.values())
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

    function removeVideo({ idToRemove, idRoom }) {
        const room = rooms.get(idRoom);
        if (!room) return;
        room.queue = room.queue.filter(video => video.id !== idToRemove);
        rooms.set(idRoom, room);
        io.to(idRoom).emit(UPDATE_ROOM, { queue: room.queue });
    }

    function viewVideo({ idVideo, idRoom }) {
        const room = rooms.get(idRoom);
        if (!room) return;
        io.to(idRoom).emit(VIEW_VIDEO, { 
            urlVideo: room.queue.find(video => video.id === idVideo).url,
            actualVideoId: idVideo
        });
    }

    function sendPlayerState({ state, idRoom }) {
        const room = rooms.get(idRoom);
        if (!room) return;
        console.log(room);
        io.to(idRoom).emit(UPDATE_ROOM, {
            isPlaying: state === 'play'
        });
    }

}

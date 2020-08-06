const { UPDATE_ROOM, VIEW_VIDEO, SEND_PLAYER_STATE } = require('./constants');

module.exports = { roomsController };

const INITIAL_URL_VIDEO = 'https://www.youtube.com/watch?time_continue=136&v=Tct7AfFaR1o&feature=emb_title';

function roomsController(io) {
    const rooms = new Map();

    return {
        create,
        join,
        addVideo,
        removeVideo,
        viewVideo,
        sendPlayerState,
        sendProgress,
        get: (id) => rooms.get(id),
    };

    function create(host) {
        const id = generateId();
        const room = {
            id,
            host,
            users: [],
            queue: [],
            urlVideo: INITIAL_URL_VIDEO,
        };
        rooms.set(id, room);
        return room;
    }

    function generateId() {
        return (Date.now().toString(36) + Math.random().toString(36).substr(2, 5)).toUpperCase();
    }

    function join(payload, socket) {
        const { id, name } = payload;
        const room = rooms.get(id);
        if (!room) return;

        if (!room.users.includes(name))
            room.users.push(name);
        rooms.set(id, room);

        socket.join(id);
        socket.to(id).emit(UPDATE_ROOM, {
            users: room.users,
        });

        console.log(room.users.length > 1)
        socket.emit(UPDATE_ROOM, {
            ...room,
            seekVideo: room.progressVideo !== 0,
        });
    }

    function addVideo({ video, id }) {
        console.log('adding video', video, id);
        const room = rooms.get(id);
        room.queue = [...room.queue, { ...video, id: generateId() }];
        rooms.set(id, room);
        io.to(id).emit(UPDATE_ROOM, { queue: room.queue });
    }

    function removeVideo({ idToRemove, idRoom }) {
        const room = rooms.get(idRoom);
        if (!room) return;
        room.queue = room.queue.filter((video) => video.id !== idToRemove);
        rooms.set(idRoom, room);
        io.to(idRoom).emit(UPDATE_ROOM, { queue: room.queue });
    }

    function viewVideo({ idVideo, idRoom }) {
        let room = rooms.get(idRoom);
        if (!room) return;
        room = {
            ...room,
            urlVideo: room.queue.find((video) => video.id === idVideo).url,
            actualVideoId: idVideo,
            progressVideo: 0,
        };
        rooms.set(idRoom, room);
        io.to(idRoom).emit(VIEW_VIDEO, {
            urlVideo: room.queue.find((video) => video.id === idVideo).url,
            actualVideoId: idVideo,
            progressVideo: 0,
        });
    }

    function sendPlayerState({ state, idRoom }) {
        console.log('video status:', state);
        const room = rooms.get(idRoom);
        if (!room) return;
        room.isPlaying = state === 'play'; 
        rooms.set(idRoom, room);
        io.to(idRoom).emit(UPDATE_ROOM, room);
    }

    function sendProgress({ progress, idRoom, name, ...rest }, socket) {
        console.log(progress, rest);
        let room = rooms.get(idRoom);
        if (!room) return;
        room = {
            ...room,
            progressVideo: progress,
        };
        rooms.set(idRoom, room);
        socket.to(idRoom).emit(UPDATE_ROOM, {
            ...room,
            progressVideo: progress,
            ...rest,
        });
    }
}

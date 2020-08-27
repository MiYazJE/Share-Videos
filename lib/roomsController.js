const { UPDATE_ROOM, VIEW_VIDEO, SEND_PLAYER_STATE } = require('./constants');

module.exports = { roomsController };

const INITIAL_URL_VIDEO = 'https://www.youtube.com/watch?time_continue=136&v=Tct7AfFaR1o&feature=emb_title';

function roomsController(io) {
    const rooms = new Map();
    const users = new Map();

    return {
        create,
        join,
        addVideo,
        removeVideo,
        viewVideo,
        sendPlayerState,
        sendProgress,
        leaveRoom,
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
            progressVideo: 0,
            actualVideoId: '',
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

        users.set(socket.id, payload);
        room.users.push(name);
        rooms.set(id, room);

        socket.join(id);
        io.to(id).emit(UPDATE_ROOM, { ...room });
        socket.emit(UPDATE_ROOM, { seekVideo: room.users.length > 1 });
    }

    function addVideo({ video, id }) {
        const room = rooms.get(id);
        video.id = generateId();
        room.queue.push({ ...video });
        rooms.set(id, room);
        io.to(id).emit(UPDATE_ROOM, { queue: room.queue });
    }

    function removeVideo({ idVideo, idRoom }) {
        const room = rooms.get(idRoom);
        if (!room) return;
        room.queue = room.queue.filter((video) => video.id !== idVideo);
        if (room.queue.length && idVideo === room.actualVideoId) {
            room.urlVideo = room.queue[0].url;
            room.actualVideoId = room.queue[0].id;
        }
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
        io.to(idRoom).emit(VIEW_VIDEO, { ...room });
    }

    function sendPlayerState({ state, idRoom, name }) {
        let room = rooms.get(idRoom);
        if (!room) return;
        room = {
            ...room,
            isPlaying: state === 'play',
            host: name
        };
        rooms.set(idRoom, room);
        io.to(idRoom).emit(UPDATE_ROOM, room);
    }

    function sendProgress({ progress, idRoom, name, seekVideo }, socket) {
        let room = rooms.get(idRoom);
        if (!room) return;
        room = {
            ...room,
            progressVideo: progress,
        };
        rooms.set(idRoom, room);
        io.to(idRoom).emit(UPDATE_ROOM, {
            ...room,
            progressVideo: progress,
            host: name,
        });
        socket.to(idRoom).emit(UPDATE_ROOM, { seekVideo });
    }

    function leaveRoom(socket) {
        const user = users.get(socket.id);
        if (!user) return;
        let room = rooms.get(user.id);
        room.users = room.users.filter(u => u != user.name);
        rooms.set(user.id, room);
        io.to(user.id).emit(UPDATE_ROOM, { users: room.users });
    }
}

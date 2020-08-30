const { UPDATE_ROOM, VIEW_VIDEO, SEND_PLAYER_STATE, NOTIFY_MESSAGE } = require('./constants');

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
        socket.emit(UPDATE_ROOM, { seekVideo: room.users.length > 1 && room.isPlaying });

        socket.to(id).emit(NOTIFY_MESSAGE, { msg: `${name.toUpperCase()} has joined!` });
        socket.emit(NOTIFY_MESSAGE, { msg: `✅ You just joined to ${id}` });
    }

    function addVideo({ video, id, name }, socket) {
        const room = rooms.get(id);
        video.id = generateId();
        room.queue.push({ ...video });
        rooms.set(id, room);
        io.to(id).emit(UPDATE_ROOM, { queue: room.queue });

        socket.to(id).emit(NOTIFY_MESSAGE, { msg: `${name.toUpperCase()} has added '${video.title}'!` });
        socket.emit(NOTIFY_MESSAGE, { msg: `You have added '${video.title}'!` });
    }
    
    function removeVideo({ idVideo, idRoom, name }, socket) {
        let room = rooms.get(idRoom);
        if (!room) return;

        const videoDeleted = room.queue.find(v => v.id === idVideo);

        room.queue = room.queue.filter((video) => video.id !== idVideo);
        if (room.queue.length && idVideo === room.actualVideoId) {
            room = {
                ...room,
                urlVideo: room.queue[0].url,
                actualVideoId: room.queue[0].id,
                progressVideo: 0,
                title: room.queue[0].title
            }
            io.to(idRoom).emit(NOTIFY_MESSAGE, { msg: `🎵 Next song is '${room.queue[0].title}'!` });
        }

        rooms.set(idRoom, room);
        io.to(idRoom).emit(UPDATE_ROOM, { queue: room.queue });
        
        if (name) {
            socket.to(idRoom).emit(NOTIFY_MESSAGE, { msg: `❌ ${name.toUpperCase()} has deleted '${videoDeleted.title}'!` });
            socket.emit(NOTIFY_MESSAGE, { msg: `❌ Video deleted from queue!` });
        }
    }

    function viewVideo({ idVideo, idRoom }) {
        let room = rooms.get(idRoom);
        if (!room) return;
        const video = room.queue.find((video) => video.id === idVideo); 
        room = {
            ...room,
            urlVideo: video.url,
            title: video.title,
            actualVideoId: idVideo,
            progressVideo: 0,
        };
        rooms.set(idRoom, room);
        io.to(idRoom).emit(VIEW_VIDEO, { ...room });

        io.to(idRoom).emit(NOTIFY_MESSAGE, { msg: `🎵 Playing '${video.title}'...` });
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
        users.delete(socket.id);
        room.users = room.users.filter(u => u != user.name);
        rooms.set(user.id, room);
        io.to(user.id).emit(UPDATE_ROOM, { users: room.users });
        io.to(user.id).emit(NOTIFY_MESSAGE, { msg: `${user.name.toUpperCase()} left the room.` });
    }
}

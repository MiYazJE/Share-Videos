const moment = require('moment');
const { UPDATE_ROOM, VIEW_VIDEO, NOTIFY_MESSAGE, UPDATE_CHAT } = require('./constants');

module.exports = { roomsController };

const MAX_CHAT_LENGTH = 40;

const INITIAL_CURRENT_VIDEO = {
    url: 'https://www.youtube.com/watch?v=ZUwPxE1eK2c',
    title: 'Ekali - Drown (feat. Au/Ra)',
};

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
        sendMessage,
        get: (id) => rooms.get(id),
    };

    function create(host) {
        const id = generateId();
        const room = {
            id,
            host,
            chat: [],
            users: [],
            queue: [],
            progressVideo: 0,
            currentVideo: { ...INITIAL_CURRENT_VIDEO },
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
        room.host = name;
        room.chat = [
            ...room.chat,
            {
                isAdmin: true,
                msg: `${name.toUpperCase()} has joined.`,
                time: getTimeNow(),
            },
        ];
        rooms.set(id, room);

        socket.join(id);
        socket.emit(UPDATE_ROOM, { ...room, seekVideo: room.isPlaying });
        io.to(id).emit(UPDATE_ROOM, { host: name, chat: room.chat, users: room.users });

        socket.to(id).emit(NOTIFY_MESSAGE, { msg: `${name.toUpperCase()} has joined!`, variant: 'success' });
        socket.emit(NOTIFY_MESSAGE, { msg: `✅ You just joined to ${id}`, variant: 'success' });
    }

    function addVideo({ video, id, name }, socket) {
        const room = rooms.get(id);
        if (!room) return;

        video.id = generateId();
        room.queue.push({ ...video });
        rooms.set(id, room);
        io.to(id).emit(UPDATE_ROOM, { queue: room.queue });

        socket
            .to(id)
            .emit(NOTIFY_MESSAGE, { msg: `${name.toUpperCase()} has added '${video.title}'!`, variant: 'success' });
        socket.emit(NOTIFY_MESSAGE, { msg: `You have added '${video.title}'!`, variant: 'success' });
    }

    function removeVideo({ idVideo, idRoom, name }, socket) {
        let room = rooms.get(idRoom);
        if (!room) return;

        const videoDeleted = room.queue.find((v) => v.id === idVideo);

        room.queue = room.queue.filter((video) => video.id !== idVideo);
        if (room.queue.length && idVideo === room.currentVideo.id) {
            room = {
                ...room,
                currentVideo: { ...room.queue[0] },
                progressVideo: 0,
            };
            io.to(idRoom).emit(NOTIFY_MESSAGE, {
                msg: `🎵 Next song is '${room.queue[0].title}'!`,
                variant: 'success',
            });
        }

        rooms.set(idRoom, room);
        io.to(idRoom).emit(UPDATE_ROOM, { queue: room.queue });

        if (name) {
            socket.to(idRoom).emit(NOTIFY_MESSAGE, {
                msg: `❌ ${name.toUpperCase()} has deleted '${videoDeleted.title}'!`,
                variant: 'error',
            });
            socket.emit(NOTIFY_MESSAGE, { msg: `❌ Video deleted from queue!`, variant: 'error' });
        }
    }

    function viewVideo({ idVideo, idRoom }) {
        let room = rooms.get(idRoom);
        if (!room) return;
        const video = room.queue.find((video) => video.id === idVideo);
        room.currentVideo = video;
        room.progressVideo = 0;
        rooms.set(idRoom, room);
        io.to(idRoom).emit(UPDATE_ROOM, { currentVideo: room.currentVideo, progressVideo: room.progressVideo });
        io.to(idRoom).emit(NOTIFY_MESSAGE, { msg: `🎵 Playing '${video.title}'...`, variant: 'success' });
    }

    function sendPlayerState({ state, idRoom, name }) {
        let room = rooms.get(idRoom);
        if (!room) return;
        room.isPlaying = state === 'play';
        room.host = name;
        rooms.set(idRoom, room);
        io.to(idRoom).emit(UPDATE_ROOM, {
            host: name,
            isPlaying: room.isPlaying,
        });
    }

    function sendProgress({ progress, idRoom, name, seekVideo }, socket) {
        let room = rooms.get(idRoom);
        if (!room) return;
        room.progressVideo = progress;
        rooms.set(idRoom, room);
        io.to(idRoom).emit(UPDATE_ROOM, { progressVideo: progress, host: name });
        socket.to(idRoom).emit(UPDATE_ROOM, { seekVideo });
    }

    function sendMessage({ name, msg, idRoom }) {
        const room = rooms.get(idRoom);
        room.chat = room.chat.concat({
            isAdmin: false,
            emitter: name,
            msg,
            time: getTimeNow(),
        });
        if (room.chat.length > MAX_CHAT_LENGTH) {
            room.chat = room.chat.slice(1);
        }
        rooms.set(idRoom, room);
        io.to(idRoom).emit(UPDATE_CHAT, room.chat);
    }

    function leaveRoom(socket) {
        const user = users.get(socket.id);
        if (!user) return;

        let room = rooms.get(user.id);
        users.delete(socket.id);
        room.users = room.users.filter((u) => u != user.name);
        rooms.set(user.id, room);

        io.to(user.id).emit(UPDATE_ROOM, { users: room.users });
        io.to(user.id).emit(NOTIFY_MESSAGE, { msg: `${user.name.toUpperCase()} left the room.`, variant: 'warning' });
    }

    function getTimeNow() {
        return moment().format('LT');
    }
}

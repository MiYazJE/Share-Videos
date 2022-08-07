const {
  UPDATE_ROOM,
  NOTIFY_MESSAGE,
  UPDATE_CHAT,
} = require('./constants');

const usersBll = require('../api/users/users.bll');
const generateAvatar = require('../app/helpers/generateAvatar');

const { generateId } = require('./utils/generateID');
const { getTimeNow } = require('./utils/getDate');

const MAX_CHAT_LENGTH = 40;

const INITIAL_CURRENT_VIDEO = {
  url: 'https://www.youtube.com/watch?v=ZUwPxE1eK2c',
  title: 'Ekali - Drown (feat. Au/Ra)',
};

function roomsController(io) {
  const rooms = new Map();
  const users = new Map();

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

  async function join(payload, socket) {
    const { id, name, isLogged } = payload;
    const room = rooms.get(id);
    if (!room) return;

    users.set(socket.id, payload);
    if (!room.users.find((u) => u.name === name)) {
      if (isLogged) {
        const user = await usersBll.getUserByName(name);
        room.users.push(user);
      } else {
        room.users.push({ name, avatarBase64: generateAvatar() });
      }
    }

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
    io.to(id).emit(UPDATE_ROOM, { chat: room.chat, users: room.users });

    socket.to(id).emit(NOTIFY_MESSAGE, { msg: `${name.toUpperCase()} has joined!`, variant: 'success' });
    socket.emit(NOTIFY_MESSAGE, { msg: `You just joined to ${id}`, variant: 'success' });
  }

  function addVideo({ video, id, name }, socket) {
    const room = rooms.get(id);
    if (!room) return;

    // eslint-disable-next-line no-param-reassign
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
      socket.emit(NOTIFY_MESSAGE, { msg: '❌ Video deleted from queue!', variant: 'error' });
    }
  }

  function viewVideo({ idVideo, idRoom }) {
    const room = rooms.get(idRoom);
    if (!room) return;
    const video = room.queue.find((v) => v.id === idVideo);
    room.currentVideo = video;
    room.progressVideo = 0;
    rooms.set(idRoom, room);
    io.to(idRoom).emit(UPDATE_ROOM, {
      currentVideo: room.currentVideo,
      progressVideo: room.progressVideo,
      isPlaying: true,
    });
    io.to(idRoom).emit(NOTIFY_MESSAGE, { msg: `🎵 Playing '${video.title}'...`, variant: 'success' });
  }

  function sendPlayerState({ state, idRoom }) {
    const room = rooms.get(idRoom);
    if (!room) return;
    room.isPlaying = state === 'play';
    rooms.set(idRoom, room);
    io.to(idRoom).emit(UPDATE_ROOM, {
      isPlaying: room.isPlaying,
    });
  }

  function sendProgress({
    progress, idRoom, seekVideo,
  }, socket) {
    const room = rooms.get(idRoom);
    if (!room) return;
    room.progressVideo = progress;
    rooms.set(idRoom, room);
    io.to(idRoom).emit(UPDATE_ROOM, { progressVideo: progress });
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

    const room = rooms.get(user.id);
    users.delete(socket.id);
    room.users = room.users.filter((u) => u.name !== user.name);
    if (room.users.length) {
      room.host = room.users[Math.floor(Math.random() * room.users.length)].name;
    }
    rooms.set(user.id, room);

    io.to(user.id).emit(UPDATE_ROOM, { users: room.users });
    io.to(user.id).emit(NOTIFY_MESSAGE, { msg: `${user.name.toUpperCase()} left the room.`, variant: 'warning' });
  }

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
}

module.exports = { roomsController };

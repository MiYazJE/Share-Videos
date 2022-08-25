const {
  UPDATE_ROOM,
  NOTIFY_MESSAGE,
  UPDATE_CHAT,
} = require('./constants');

const usersBll = require('../app/api/users/users.bll');
const generateAvatar = require('../app/helpers/generateAvatar');

const { generateId } = require('./utils/generateID');
const { getTimeNow } = require('./utils/getDate');

const MAX_CHAT_LENGTH = 40;

const INITIAL_CURRENT_VIDEO = {
  url: 'https://www.youtube.com/watch?v=OgIRAjnnJzI',
  title: 'Soy programador fp',
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
    const { roomId, name, isLogged } = payload;
    const room = rooms.get(roomId);
    if (!room) return;

    let user = null;
    if (isLogged) {
      user = await usersBll.getUserByName(name);
    } else {
      user = {
        id: generateId(),
        name,
        avatarBase64: generateAvatar(),
      };
    }

    room.users.push(user);
    users.set(socket.id, { ...payload, ...user });

    room.chat = [
      ...room.chat,
      {
        isAdmin: true,
        msg: `${name.toUpperCase()} has joined.`,
        time: getTimeNow(),
      },
    ];
    rooms.set(roomId, room);

    socket.join(roomId);
    socket.emit(UPDATE_ROOM, { ...room, seekVideo: room.isPlaying });
    io.to(roomId).emit(UPDATE_ROOM, { chat: room.chat, users: room.users });

    socket.to(roomId).emit(NOTIFY_MESSAGE, { msg: `${name.toUpperCase()} has joined!`, variant: 'success' });
    socket.emit(NOTIFY_MESSAGE, { msg: `You just joined to room ${roomId}`, variant: 'success' });
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

  function removeVideo({ idVideo, roomId, name }, socket) {
    let room = rooms.get(roomId);
    if (!room) return;

    const deletedVideoIdx = room.queue.findIndex((v) => v.id === idVideo);
    const deletedVideo = room.queue[deletedVideoIdx];
    const currentVideoIsDeleted = room.currentVideo.id === deletedVideo.id;

    room.queue = room.queue.filter((video) => video.id !== idVideo);

    if (room.queue.length && currentVideoIsDeleted) {
      const nextVideoIndex = deletedVideoIdx < room.queue.length
        ? deletedVideoIdx
        : deletedVideoIdx - 1;

      const nextVideo = room.queue[nextVideoIndex];

      room = {
        ...room,
        isPlaying: true,
        currentVideo: nextVideo,
        progressVideo: 0,
      };

      io.to(roomId).emit(NOTIFY_MESSAGE, {
        msg: `Next video is '${nextVideo.title}'`,
        variant: 'success',
      });
    }

    rooms.set(roomId, room);
    io.to(roomId).emit(UPDATE_ROOM, room);

    if (name) {
      socket.to(roomId).emit(NOTIFY_MESSAGE, {
        msg: `${name.toUpperCase()} has deleted '${deletedVideo.title}'`,
        variant: 'error',
      });
      socket.emit(NOTIFY_MESSAGE, { msg: 'Video deleted from queue', variant: 'error' });
    }
  }

  function viewVideo({ video, roomId }) {
    const room = rooms.get(roomId);
    if (!room) return;

    room.currentVideo = video;
    room.progressVideo = 0;
    rooms.set(roomId, room);

    io.to(roomId).emit(UPDATE_ROOM, {
      currentVideo: room.currentVideo,
      progressVideo: room.progressVideo,
      isPlaying: true,
    });
    io.to(roomId).emit(NOTIFY_MESSAGE, { msg: `Playing '${video.title}'...`, variant: 'success' });
  }

  function sendPlayerState({ state, roomId }) {
    const room = rooms.get(roomId);
    if (!room) return;

    room.isPlaying = state === 'play';
    rooms.set(roomId, room);
    io.to(roomId).emit(UPDATE_ROOM, {
      isPlaying: room.isPlaying,
    });
  }

  function reorderPlaylist({ playlist, roomId }) {
    const room = rooms.get(roomId);
    if (!room) return;

    room.queue = playlist;
    rooms.set(roomId, room);

    io.to(roomId).emit(UPDATE_ROOM, {
      queue: playlist,
    });
  }

  function sendProgress({
    progress,
    roomId,
    seekVideo,
  }, socket) {
    const room = rooms.get(roomId);
    if (!room) return;
    room.progressVideo = progress;
    rooms.set(roomId, room);
    io.to(roomId).emit(UPDATE_ROOM, { progressVideo: progress });
    socket.to(roomId).emit(UPDATE_ROOM, { seekVideo });
  }

  function sendMessage({
    name,
    msg,
    roomId,
    color,
  }) {
    const room = rooms.get(roomId);
    room.chat = room.chat.concat({
      isAdmin: false,
      emitter: name,
      msg,
      time: getTimeNow(),
      color,
    });
    if (room.chat.length > MAX_CHAT_LENGTH) {
      room.chat = room.chat.slice(1);
    }
    rooms.set(roomId, room);
    io.to(roomId).emit(UPDATE_CHAT, room.chat);
  }

  function leaveRoom(reason, socket) {
    const user = users.get(socket.id);
    if (!user) return;

    const room = rooms.get(user.roomId);
    users.delete(socket.id);
    room.users = room.users.filter((u) => u.id !== user.id);

    if (!room.users.length) {
      console.log(`Closing room ${room.id} because its empty and reason:`, reason);
      rooms.delete(user.roomId);
      return;
    }

    room.host = room.users[Math.floor(Math.random() * room.users.length)].name;
    rooms.set(user.roomId, room);

    io.to(user.roomId).emit(UPDATE_ROOM, { users: room.users });
    io.to(user.roomId).emit(NOTIFY_MESSAGE, { msg: `${user.name.toUpperCase()} left the room`, variant: 'warning' });

    socket.leave(room.id);
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
    reorderPlaylist,
    get: (id) => rooms.get(id),
  };
}

module.exports = { roomsController };

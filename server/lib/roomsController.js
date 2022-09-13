const {
  UPDATE_ROOM,
  NOTIFY_MESSAGE,
  UPDATE_CHAT,
} = require('./constants');

const usersBll = require('../app/api/users/users.bll');
const generateAvatar = require('../app/helpers/generateAvatar');
const createEventsHandler = require('./eventsHandler');

const { generateId } = require('./utils/generateID');
const { getTimeNow } = require('./utils/getDate');

const MAX_CHAT_LENGTH = 40;

const INITIAL_CURRENT_VIDEO = {
  id: generateId(),
  url: 'https://www.youtube.com/watch?v=OgIRAjnnJzI',
  title: 'Soy programador fp',
};

function roomsController(io) {
  const rooms = new Map();
  const users = new Map();
  const eventsHandler = createEventsHandler(io);

  async function createRoom(id, room) {
    rooms.set(id, room);
  }

  async function getRoom(id) {
    return Promise.resolve(rooms.get(id));
  }

  async function deleteRoom(id) {
    return rooms.delete(id);
  }

  async function create(host) {
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
    await createRoom(id, room);
    return room;
  }

  async function join(payload, socket) {
    const { roomId, name, isLogged } = payload;
    const room = await getRoom(roomId);
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

    eventsHandler.joinRoom(socket, roomId);

    eventsHandler.emitToMe(socket, UPDATE_ROOM, { ...room, seekVideo: room.isPlaying });
    eventsHandler.broadcastToRoom(roomId, UPDATE_ROOM, { chat: room.chat, users: room.users });

    eventsHandler.emitToRoom(socket, roomId, NOTIFY_MESSAGE, { msg: `${name.toUpperCase()} has joined!`, variant: 'success' });
    eventsHandler.emitToMe(socket, NOTIFY_MESSAGE, { msg: `You just joined to room ${roomId}`, variant: 'success' });
  }

  async function addVideo({ video, id: roomId, name }, socket) {
    const room = await getRoom(roomId);
    if (!room) return;

    // eslint-disable-next-line no-param-reassign
    video.id = generateId();
    room.queue.push({ ...video });
    rooms.set(roomId, room);

    eventsHandler.broadcastToRoom(roomId, UPDATE_ROOM, { queue: room.queue });
    eventsHandler.broadcastToRoom(roomId, NOTIFY_MESSAGE, { msg: `${name.toUpperCase()} has added '${video.title}'!`, variant: 'success' });
    eventsHandler.emitToMe(socket, roomId, NOTIFY_MESSAGE, { msg: `You have added '${video.title}'!`, variant: 'success' });
  }

  async function removeVideo({ idVideo, roomId, name }, socket) {
    let room = await getRoom(roomId);
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

      eventsHandler.broadcastToRoom(roomId, NOTIFY_MESSAGE, {
        msg: `Next video is '${nextVideo.title}'`,
        variant: 'success',
      });
    }

    rooms.set(roomId, room);
    eventsHandler.broadcastToRoom(roomId, UPDATE_ROOM, room);

    if (name) {
      eventsHandler.emitToRoom(socket, roomId, NOTIFY_MESSAGE, {
        msg: `${name.toUpperCase()} has deleted '${deletedVideo.title}'`,
        variant: 'error',
      });
      eventsHandler.emitToMe(socket, NOTIFY_MESSAGE, { msg: 'Video deleted from queue', variant: 'error' });
    }
  }

  async function viewVideo({ video, roomId }) {
    const room = await getRoom(roomId);
    if (!room) return;

    room.currentVideo = video;
    room.progressVideo = 0;
    room.isPlaying = true;
    rooms.set(roomId, room);

    eventsHandler.broadcastToRoom(roomId, UPDATE_ROOM, {
      currentVideo: room.currentVideo,
      progressVideo: room.progressVideo,
      isPlaying: true,
    });
    eventsHandler.broadcastToRoom(roomId, NOTIFY_MESSAGE, { msg: `Playing '${video.title}'...`, variant: 'success' });
  }

  async function sendPlayerState({ state, roomId }) {
    const room = await getRoom(roomId);
    if (!room) return;

    room.isPlaying = state === 'play';
    rooms.set(roomId, room);
    eventsHandler.broadcastToRoom(roomId, UPDATE_ROOM, { isPlaying: room.isPlaying });
  }

  async function reorderPlaylist({ playlist, roomId }) {
    const room = await getRoom(roomId);
    if (!room) return;

    room.queue = playlist;
    rooms.set(roomId, room);

    eventsHandler.broadcastToRoom(roomId, UPDATE_ROOM, { queue: playlist });
  }

  async function sendProgress({
    progress,
    roomId,
    seekVideo,
  }, socket) {
    const room = await getRoom(roomId);
    if (!room) return;

    room.progressVideo = progress;
    rooms.set(roomId, room);

    eventsHandler.broadcastToRoom(roomId, UPDATE_ROOM, { progressVideo: progress });
    eventsHandler.emitToRoom(socket, roomId, UPDATE_ROOM, { seekVideo });
  }

  async function sendMessage({
    name,
    msg,
    roomId,
    color,
  }) {
    const room = await getRoom(roomId);
    if (!room) return;

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

    eventsHandler.broadcastToRoom(roomId, UPDATE_CHAT, room.chat);
  }

  async function leaveRoom(reason, socket) {
    const user = users.get(socket.id);
    if (!user) return;

    const room = await getRoom(user.roomId);
    users.delete(socket.id);
    room.users = room.users.filter((u) => u.id !== user.id);

    if (!room.users.length) {
      console.log(`Closing room ${room.id} because its empty and reason:`, reason);
      await deleteRoom(user.roomId);
      return;
    }

    room.host = room.users[Math.floor(Math.random() * room.users.length)].name;
    rooms.set(user.roomId, room);

    eventsHandler.broadcastToRoom(user.roomId, UPDATE_ROOM, { users: room.users });
    eventsHandler.broadcastToRoom(user.roomId, NOTIFY_MESSAGE, { msg: `${user.name.toUpperCase()} left the room`, variant: 'warning' });
    eventsHandler.leaveRoom(socket, user.roomId);
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
    get: getRoom,
  };
}

module.exports = { roomsController };

const { roomsController } = require('../roomsController');

const NAME = 'me';
const NAME_2 = 'you';

const SOCKET_MOCK = {
  id: 'randomSocketId',
};

const SOCKET_MOCK_2 = {
  id: 'randomSocketId2',
};

const mockJoinRoom = jest.fn(() => {});
const mockEmitToRoom = jest.fn(() => {});
const mockBroadcastToRoom = jest.fn(() => {});
const mockLeaveRoom = jest.fn(() => {});
const mockEmitToMe = jest.fn(() => {});

jest.mock('../eventsHandler.js', () => jest.fn(() => ({
  joinRoom: mockJoinRoom,
  emitToRoom: mockEmitToRoom,
  broadcastToRoom: mockBroadcastToRoom,
  leaveRoom: mockLeaveRoom,
  emitToMe: mockEmitToMe,
})));

jest.mock('../../app/helpers/generateAvatar.js', () => jest.fn(() => ''));

let roomsCtrl;

describe('Rooms controller test', () => {
  beforeEach(() => {
    roomsCtrl = roomsController();
  });

  test('Should create a room', async () => {
    const { id } = await roomsCtrl.create('HOST');
    expect(id).toBeDefined();

    const room = await roomsCtrl.get(id);
    expect(room.id).toBeDefined();
    expect(room.host).toBe('HOST');
    expect(room.chat).toStrictEqual([]);
    expect(room.users).toStrictEqual([]);
    expect(room.queue).toStrictEqual([]);
    expect(room.progressVideo).toBe(0);
    expect(typeof room.currentVideo).toBe('object');
  });

  test('Should join to an existing room', async () => {
    const { id: roomId } = await roomsCtrl.create('me');

    const payload = {
      roomId,
      name: NAME,
    };
    await roomsCtrl.join(payload, SOCKET_MOCK);
    const room = await roomsCtrl.get(roomId);

    expect(room.host).toBe('me');
    expect(room.users).toHaveLength(1);
    expect(room.users[0].id).toBeDefined();
    expect(room.users[0].name).toBe('me');
    expect(room.users[0].avatarBase64).toBeDefined();

    expect(room.chat).toHaveLength(1);
    expect(room.chat[0].isAdmin).toBe(true);
    expect(room.chat[0].msg).toBe('ME has joined.');

    expect(mockJoinRoom).toHaveBeenCalledTimes(1);
    expect(mockJoinRoom.mock.calls[0][1]).toBe(roomId);
  });

  test('Should add video to queue', async () => {
    const { id: roomId } = await roomsCtrl.create('HOST');

    await roomsCtrl.join({
      roomId,
      name: NAME,
    }, SOCKET_MOCK);

    const payload = {
      id: roomId,
      name: NAME,
      video: {
        url: 'videoUrl',
      },
    };
    jest.clearAllMocks();
    await roomsCtrl.addVideo(payload, SOCKET_MOCK);

    const room = await roomsCtrl.get(roomId);
    expect(room.users).toHaveLength(1);
    expect(room.users[0].name).toBe(NAME);

    expect(room.queue).toHaveLength(1);
    expect(room.queue[0]).toStrictEqual(payload.video);

    expect(mockBroadcastToRoom).toHaveBeenCalledTimes(2);
    expect(mockBroadcastToRoom.mock.calls[0][0]).toBe(roomId);
    expect(mockBroadcastToRoom.mock.calls[0][1]).toBe('WS_UPDATE_ROOM');
    expect(mockBroadcastToRoom.mock.calls[1][0]).toBe(roomId);
    expect(mockBroadcastToRoom.mock.calls[1][1]).toBe('WS_NOTIFY_MESSAGE');

    expect(mockEmitToMe).toHaveBeenCalledTimes(1);
    expect(mockEmitToMe.mock.calls[0][0]).toStrictEqual(SOCKET_MOCK);
    expect(mockEmitToMe.mock.calls[0][1]).toBe(roomId);
    expect(mockEmitToMe.mock.calls[0][2]).toBe('WS_NOTIFY_MESSAGE');
  });

  test('Should change current video de', async () => {
    const { id: roomId } = await roomsCtrl.create('HOST');

    await roomsCtrl.join({
      roomId,
      name: NAME,
    }, SOCKET_MOCK);

    await roomsCtrl.addVideo({
      id: roomId,
      name: NAME,
      video: {
        url: 'videoUrl',
      },
    }, SOCKET_MOCK);

    let room = await roomsCtrl.get(roomId);

    jest.clearAllMocks();
    await roomsCtrl.removeVideo({
      idVideo: room.queue[0].id,
      roomId,
      name: NAME,
    }, SOCKET_MOCK);

    room = await roomsCtrl.get(roomId);
    expect(room.queue).toHaveLength(0);

    expect(mockBroadcastToRoom).toHaveBeenCalledTimes(1);
    expect(mockBroadcastToRoom.mock.calls[0][0]).toBe(roomId);
    expect(mockBroadcastToRoom.mock.calls[0][1]).toBe('WS_UPDATE_ROOM');
    expect(mockBroadcastToRoom.mock.calls[0][2].queue).toHaveLength(0);

    expect(mockEmitToRoom).toHaveBeenCalledTimes(1);
    expect(mockEmitToRoom.mock.calls[0][0]).toStrictEqual(SOCKET_MOCK);
    expect(mockEmitToRoom.mock.calls[0][1]).toBe(roomId);
    expect(mockEmitToRoom.mock.calls[0][2]).toBe('WS_NOTIFY_MESSAGE');

    expect(mockEmitToMe).toHaveBeenCalledTimes(1);
    expect(mockEmitToMe.mock.calls[0][0]).toStrictEqual(SOCKET_MOCK);
    expect(mockEmitToMe.mock.calls[0][1]).toBe('WS_NOTIFY_MESSAGE');
  });

  test('Should play a video', async () => {
    const { id: roomId } = await roomsCtrl.create('HOST');

    await roomsCtrl.join({
      roomId,
      name: NAME,
    }, SOCKET_MOCK);

    jest.clearAllMocks();
    const video = { ur: 'url' };
    await roomsCtrl.viewVideo({ video, roomId });

    const room = await roomsCtrl.get(roomId);
    expect(room.currentVideo).toStrictEqual(video);
    expect(room.progressVideo).toEqual(0);
    expect(room.isPlaying).toBe(true);

    expect(mockBroadcastToRoom).toHaveBeenCalledTimes(2);

    expect(mockBroadcastToRoom.mock.calls[0][0]).toBe(roomId);
    expect(mockBroadcastToRoom.mock.calls[0][1]).toBe('WS_UPDATE_ROOM');
    expect(mockBroadcastToRoom.mock.calls[0][2]).toStrictEqual({
      currentVideo: video,
      progressVideo: 0,
      isPlaying: true,
    });

    expect(mockBroadcastToRoom.mock.calls[1][0]).toBe(roomId);
    expect(mockBroadcastToRoom.mock.calls[1][1]).toBe('WS_NOTIFY_MESSAGE');
  });

  test('Should send a message', async () => {
    const { id: roomId } = await roomsCtrl.create('HOST');

    await roomsCtrl.join({
      roomId,
      name: NAME,
    }, SOCKET_MOCK);

    const payload = {
      name: NAME,
      msg: '¡Hello World!',
      roomId,
      color: 'color',
    };
    jest.clearAllMocks();
    await roomsCtrl.sendMessage(payload);

    const room = await roomsCtrl.get(roomId);

    expect(room.chat).toHaveLength(2);
    const message = room.chat[1];
    expect(message.isAdmin).toBe(false);
    expect(message.emitter).toBe(NAME);
    expect(message.msg).toBe('¡Hello World!');
    expect(message.time).toBeDefined();
    expect(message.color).toBe('color');

    expect(mockBroadcastToRoom).toHaveBeenCalledTimes(1);
    expect(mockBroadcastToRoom.mock.calls[0][0]).toBe(roomId);
    expect(mockBroadcastToRoom.mock.calls[0][1]).toBe('WS_UPDATE_CHAT');
    expect(mockBroadcastToRoom.mock.calls[0][2]).toHaveLength(2);
  });

  test('Should leave a room and the room should be closed', async () => {
    const { id: roomId } = await roomsCtrl.create('HOST');

    await roomsCtrl.join({
      roomId,
      name: NAME,
    }, SOCKET_MOCK);

    jest.clearAllMocks();
    await roomsCtrl.leaveRoom('reason', SOCKET_MOCK);

    const room = await roomsCtrl.get(roomId);

    expect(room).toBeFalsy();

    expect(mockBroadcastToRoom).toHaveBeenCalledTimes(0);
    expect(mockBroadcastToRoom).toHaveBeenCalledTimes(0);
  });

  test('Should leave a room and the room should not be closed', async () => {
    const { id: roomId } = await roomsCtrl.create('HOST');

    await roomsCtrl.join({
      roomId,
      name: NAME,
    }, SOCKET_MOCK);
    await roomsCtrl.join({
      roomId,
      name: NAME_2,
    }, SOCKET_MOCK_2);

    jest.clearAllMocks();
    await roomsCtrl.leaveRoom('reason', SOCKET_MOCK);

    const room = await roomsCtrl.get(roomId);

    expect(room).toBeTruthy();
    expect(room.users).toHaveLength(1);
    expect(room.users[0].name).toBe(NAME_2);
    expect(room.host).toBe(NAME_2);

    expect(mockBroadcastToRoom).toHaveBeenCalledTimes(2);
    expect(mockBroadcastToRoom.mock.calls[0][0]).toBe(roomId);
    expect(mockBroadcastToRoom.mock.calls[0][1]).toBe('WS_UPDATE_ROOM');
    expect(mockBroadcastToRoom.mock.calls[0][2].users).toHaveLength(1);
    expect(mockBroadcastToRoom.mock.calls[0][2].users[0].name).toBe(NAME_2);

    expect(mockBroadcastToRoom.mock.calls[1][0]).toBe(roomId);
    expect(mockBroadcastToRoom.mock.calls[1][1]).toBe('WS_NOTIFY_MESSAGE');
    expect(mockBroadcastToRoom.mock.calls[1][2].msg).toBe(`${NAME.toUpperCase()} left the room`);

    expect(mockLeaveRoom).toHaveBeenCalledTimes(1);
    expect(mockLeaveRoom.mock.calls[0][0]).toStrictEqual(SOCKET_MOCK);
    expect(mockLeaveRoom.mock.calls[0][1]).toBe(roomId);
  });
});

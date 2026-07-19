const mockRoomsCtrl = {
  join: jest.fn(),
  addVideo: jest.fn(),
  removeVideo: jest.fn(),
  sendProgress: jest.fn(),
  sendPlayerState: jest.fn(),
  viewVideo: jest.fn(),
  sendMessage: jest.fn(),
  reorderPlaylist: jest.fn(),
  leaveRoom: jest.fn(),
};

jest.mock('./roomsController', () => ({
  roomsController: jest.fn(() => mockRoomsCtrl),
}));

const initSocketIo = require('./socketIo');

describe('Socket.IO registration', () => {
  let handlers;
  let socket;

  beforeEach(() => {
    handlers = {};
    socket = {
      id: 'socket-1',
      connected: false,
      emit: jest.fn(),
      on: jest.fn((event, handler) => { handlers[event] = handler; }),
    };
    const io = {
      on: jest.fn((event, handler) => {
        if (event === 'connection') handler(socket);
      }),
    };
    jest.clearAllMocks();
    initSocketIo(io);
  });

  test.each([
    'transport close',
    'client namespace disconnect',
    'ping timeout',
    'server namespace disconnect',
  ])('cleans membership for disconnect reason %s', async (reason) => {
    await handlers.disconnect(reason);

    expect(mockRoomsCtrl.leaveRoom).toHaveBeenCalledWith(reason, socket);
    expect(socket.connect).toBeUndefined();
  });

  test('contains a rejected room handler', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    mockRoomsCtrl.join.mockRejectedValueOnce(new Error('join failed'));

    await handlers.WS_JOIN_ROOM({ roomId: 'room' });

    expect(console.error).toHaveBeenCalledWith('Socket event failed', expect.objectContaining({
      event: 'WS_JOIN_ROOM',
      socketId: socket.id,
    }));
    jest.restoreAllMocks();
  });
});

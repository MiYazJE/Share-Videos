const socketHandler = require('./socketHandler');

describe('socketHandler', () => {
  let socket;

  beforeEach(() => {
    socket = { id: 'socket-1', connected: true, emit: jest.fn() };
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => jest.restoreAllMocks());

  test.each([
    ['a synchronous throw', () => { throw new Error('sync'); }],
    ['a rejected promise', () => Promise.reject(new Error('async'))],
  ])('contains %s and sends a generic notification', async (_, handler) => {
    await socketHandler('WS_TEST', socket, handler)({ secret: 'payload' });

    expect(console.error).toHaveBeenCalledWith('Socket event failed', {
      event: 'WS_TEST',
      socketId: socket.id,
      error: expect.any(Error),
    });
    expect(socket.emit).toHaveBeenCalledWith('WS_NOTIFY_MESSAGE', {
      msg: 'The requested action could not be completed',
      variant: 'error',
    });
    expect(JSON.stringify(console.error.mock.calls)).not.toContain('payload');
  });

  test('continues processing later events after a rejection', async () => {
    const handler = jest.fn()
      .mockRejectedValueOnce(new Error('first'))
      .mockResolvedValueOnce('ok');
    const wrapped = socketHandler('WS_TEST', socket, handler);

    await wrapped();
    await wrapped();

    expect(handler).toHaveBeenCalledTimes(2);
  });

  test('does not emit an error notification to a disconnected socket', async () => {
    socket.connected = false;

    await socketHandler('disconnect', socket, async () => { throw new Error('failure'); })();

    expect(socket.emit).not.toHaveBeenCalled();
  });
});

const EventEmitter = require('events');

const createLifecycle = require('./lifecycle');

function createResources({ hanging = false } = {}) {
  const close = jest.fn((callback) => {
    if (!hanging) callback();
  });
  return {
    server: { close },
    io: { close: jest.fn((callback) => callback()) },
    database: { close: jest.fn(() => Promise.resolve()) },
  };
}

describe('server lifecycle', () => {
  let readiness;
  let logger;
  let exit;

  beforeEach(() => {
    readiness = { markUnready: jest.fn() };
    logger = { log: jest.fn(), error: jest.fn() };
    exit = jest.fn();
  });

  test('marks unready, closes resources once, and exits non-zero for a fatal error', async () => {
    const resources = createResources();
    const lifecycle = createLifecycle({ ...resources, readiness, logger, exit });

    const firstShutdown = lifecycle.shutdown({
      reason: 'uncaughtException',
      error: new Error('fatal'),
      exitCode: 1,
    });
    const secondShutdown = lifecycle.shutdown({ reason: 'SIGTERM' });
    await Promise.all([firstShutdown, secondShutdown]);

    expect(firstShutdown).toBe(secondShutdown);
    expect(readiness.markUnready).toHaveBeenCalledTimes(1);
    expect(resources.server.close).toHaveBeenCalledTimes(1);
    expect(resources.io.close).toHaveBeenCalledTimes(1);
    expect(resources.database.close).toHaveBeenCalledTimes(1);
    expect(exit).toHaveBeenCalledWith(1);
  });

  test('enforces a shutdown deadline', async () => {
    const resources = createResources({ hanging: true });
    const lifecycle = createLifecycle({
      ...resources,
      readiness,
      logger,
      exit,
      shutdownTimeoutMs: 10,
    });

    await lifecycle.shutdown({ reason: 'uncaughtException', error: new Error('fatal'), exitCode: 1 });

    expect(logger.error).toHaveBeenCalledWith('Server shutdown timed out', {
      reason: 'uncaughtException',
      shutdownTimeoutMs: 10,
    });
    expect(exit).toHaveBeenCalledWith(1);
  });

  test.each([
    ['unhandledRejection', 1],
    ['uncaughtException', 1],
    ['SIGTERM', 0],
    ['SIGINT', 0],
  ])('registers process handler for %s', async (event, exitCode) => {
    const processRef = new EventEmitter();
    const lifecycle = createLifecycle({
      ...createResources(),
      readiness,
      logger,
      exit,
      processRef,
    });
    lifecycle.registerProcessHandlers();

    processRef.emit(event, event.includes('Exception') || event.includes('Rejection')
      ? new Error('fatal')
      : undefined);
    await new Promise((resolve) => setImmediate(resolve));

    expect(exit).toHaveBeenCalledWith(exitCode);
    lifecycle.removeProcessHandlers();
  });
});

function closeWithCallback(resource, method) {
  if (!resource || typeof resource[method] !== 'function') return Promise.resolve();

  return new Promise((resolve, reject) => {
    resource[method]((error) => {
      if (error && error.code !== 'ERR_SERVER_NOT_RUNNING') reject(error);
      else resolve();
    });
  });
}

function closeDatabase(database) {
  return Promise.resolve().then(() => database?.close?.());
}

function createLifecycle({
  server,
  io,
  database,
  readiness,
  logger = console,
  shutdownTimeoutMs = 10000,
  exit = (code) => process.exit(code),
  processRef = process,
}) {
  let shutdownPromise;

  function shutdown({ reason, error, exitCode = 0 }) {
    if (shutdownPromise) return shutdownPromise;

    readiness.markUnready();
    if (error) logger.error('Fatal server error', { reason, error });
    else logger.log('Server shutdown requested', { reason });

    shutdownPromise = (async () => {
      const cleanup = Promise.allSettled([
        closeWithCallback(io, 'close'),
        closeWithCallback(server, 'close'),
        closeDatabase(database),
      ]);
      let timeout;
      const deadline = new Promise((resolve) => {
        timeout = setTimeout(() => resolve('timeout'), shutdownTimeoutMs);
      });

      const result = await Promise.race([
        cleanup.then(() => 'closed'),
        deadline,
      ]);
      clearTimeout(timeout);

      if (result === 'timeout') {
        logger.error('Server shutdown timed out', { reason, shutdownTimeoutMs });
      }

      exit(exitCode);
    })();

    return shutdownPromise;
  }

  const onSigterm = () => shutdown({ reason: 'SIGTERM' });
  const onSigint = () => shutdown({ reason: 'SIGINT' });
  const onUnhandledRejection = (error) => shutdown({
    reason: 'unhandledRejection',
    error,
    exitCode: 1,
  });
  const onUncaughtException = (error) => shutdown({
    reason: 'uncaughtException',
    error,
    exitCode: 1,
  });

  function registerProcessHandlers() {
    processRef.once('SIGTERM', onSigterm);
    processRef.once('SIGINT', onSigint);
    processRef.once('unhandledRejection', onUnhandledRejection);
    processRef.once('uncaughtException', onUncaughtException);
  }

  function removeProcessHandlers() {
    processRef.removeListener('SIGTERM', onSigterm);
    processRef.removeListener('SIGINT', onSigint);
    processRef.removeListener('unhandledRejection', onUnhandledRejection);
    processRef.removeListener('uncaughtException', onUncaughtException);
  }

  return {
    registerProcessHandlers,
    removeProcessHandlers,
    shutdown,
  };
}

module.exports = createLifecycle;

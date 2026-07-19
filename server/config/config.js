const config = {
  appPort: process.env.PORT || 3000,
  mongo: {
    url: process.env.URL_MONGO_DB || 'mongodb://mongo:27017',
    properties: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      dbName: process.env.NAME_MONGO_DB || 'share-videos',
    },
  },
  jwt: {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  secretKey: process.env.SECRET_KEY || 'SECRET_KEY',
  accessSecretToken: process.env.ACCESS_SECRET_TOKEN || 'ACCESS_SECRET_TOKEN',
  shutdownTimeoutMs: Number(process.env.SHUTDOWN_TIMEOUT_MS) || 10000,
};

module.exports = config;

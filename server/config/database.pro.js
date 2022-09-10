const mongoose = require('mongoose');

const config = require('./config');

const { mongo } = config;

const clientDb = {
  getDb: () => mongoose.connection,
  connect: async () => {
    console.log('*** MONGO UP ***');
    await mongoose.connect(mongo.url, mongo.properties);
  },
  close: async () => {
    await mongoose.disconnect();
  },
};

module.exports = clientDb;

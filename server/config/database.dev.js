const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let db;

const clientDb = {
  connect: async () => {
    db = await MongoMemoryServer.create();
    const uri = db.getUri();
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  },
  dropCollections: async () => {
    if (!db) return;
    const collections = await mongoose.connection.db.collections();
    const promises = collections.map((c) => c.deleteMany());
    await Promise.all(promises);
  },
  close: async () => {
    if (!db) return;
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await db.stop();
  },
};

module.exports = clientDb;

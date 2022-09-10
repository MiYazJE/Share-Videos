const mongoDatabase = require('./database.pro');
const mongoDatabaseInMemory = require('./database.dev');
const config = require('./config');

const { inMemoryDatabase } = config;

const clientDb = inMemoryDatabase
  ? mongoDatabaseInMemory
  : mongoDatabase;

module.exports = clientDb;

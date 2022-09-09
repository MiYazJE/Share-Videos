const mongoose = require('mongoose');
const config = require('./config');

const { mongo } = config;

const initializeMongoDB = async () => {
  try {
    await mongoose.connect(mongo.url, mongo.properties);
    console.log('*** MongoDB UP ***');
  } catch (e) {
    console.log(e.message);
  }
};

module.exports = {
  initializeMongoDB,
};

require('dotenv').config();

const config = {
  url: process.env.URL_MONGO_DB || 'mongodb://mongo:27017/share-videos',
  properties: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  },
};

module.exports = config;

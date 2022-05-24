require('dotenv').config();

const config = {
  url: process.env.URL_MONGO_DB || 'mongodb://localhost:27017/ShareVideos',
  properties: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  },
};

module.exports = config;

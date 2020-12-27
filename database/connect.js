const mongoose = require('mongoose');
const config = require('./config');

const initializeMongoDB = async () => {
    try {
        await mongoose.connect(config.url, config.properties);
        console.log('*** MongoDB UP ***');
    } catch (e) {
        console.log(e.message);
    }
};

module.exports = {
    initializeMongoDB,
};

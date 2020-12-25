const mysql = require('mysql2/promise');
const config = require('./config');

module.exports = {
    getConnection: () => mysql.createPool(config),
};

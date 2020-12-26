const mysql = require('mysql2/promise');
const config = require('./config');

let connection;

module.exports = {
    getConnection: async () => {
        if (connection) return connection;
        connection = await mysql.createConnection(config);
        return connection;
    },
};

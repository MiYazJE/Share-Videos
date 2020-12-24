const config = require('./config');
const mysql = require('mysql2/promise');

let connection;

async function connect() {
    connection = await mysql.createConnection(config);
}

async function getConnection() {
    if (!connection) await connect();
    return connection;
}

module.exports = { getConnection };
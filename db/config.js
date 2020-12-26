require('dotenv').config();

const config = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_DATABASE_NAME || 'share_videos',
    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0,
};

module.exports = config;

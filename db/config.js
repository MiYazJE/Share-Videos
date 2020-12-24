require('dotenv').config();

const config = {
    host: process.env.ENVIROMENT === 'production' ? process.env.DB_HOST : 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database:  process.env.DB_DATABASE_NAME
};

module.exports = config
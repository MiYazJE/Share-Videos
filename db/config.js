require('dotenv').config();

let host     = 'localhost';
let user     = 'ruben';
let password = 'root';
let database = 'share_videos';

if (process.env.ENVIROMENT === 'production') {
    host     = process.env.DB_HOST;
    user     = process.env.DB_USER;
    password = process.env.DB_PASSWORD;
    database = process.env.DB_DATABASE_NAME;
}

const config = {
    host,
    user,
    password,
    database,
};

module.exports = config
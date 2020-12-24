const fetch = require('node-fetch');
const youtube = require('youtube-sr');
const { comparePassword, encryptPassword } = require('../lib/auth.helpers');
const { getConnection } = require('../../db/connect');

const URL_GOOGLE_SUGGEST = 'http://suggestqueries.google.com/complete/search?client=youtube&ds=yt&hl=es&q=';

module.exports = {
    searchVideoSuggestions,
    getVideos,
    register,
    login,
};

async function searchVideoSuggestions(req, res) {
    const { q } = req.params;
    const response = await fetch(`${URL_GOOGLE_SUGGEST}${q}`);
    const suggestions = mapSuggestions(await response.text());
    res.json([...suggestions]);
}

function mapSuggestions(suggestions) {
    const regexp = /\[\"[\w\s]+"/gi;
    return suggestions.match(regexp).map((w) => w.substring(2, w.length - 1));
}

async function getVideos(req, res) {
    const { q } = req.params;
    const videos = await youtube.search(q, { limit: 20 });
    res.json(mapVideos(videos));
}

function mapVideos(videos) {
    return videos.map((video) => {
        const { durationFormatted: duration, url, views, title, thumbnail: { url: urlThumbnail }, uploadedAt } = video;
        return {
            url,
            views,
            title,
            urlThumbnail,
            uploadedAt,
            duration
        };
    });
}

async function register(req, res) {
    const { name, password, email } = req.body;
    const connection = await getConnection();
    
    const [emailAlreadyRegistered] = await connection.execute('SELECT * from users where `email` = ?', [email]);
    if (emailAlreadyRegistered.length) {
        return res.json({ error: true, msg: 'Same email already registered.' });
    }
    
    const [nameAlreadyRegistered] = await connection.execute('SELECT * from users where `name` = ?', [name])
    if (nameAlreadyRegistered.length) {
        return res.json({ error: true, msg: 'That name has been taken.' });
    }

    const encryptedPassword = await encryptPassword(password);
    await connection.execute('INSERT INTO users VALUES(NULL, ?, ?, ?)', [name, encryptedPassword, email])

    res.json({ error: false, msg: 'You have been registered.' });
}

async function login(req, res) {
    const { nameOrEmail, password } = req.body;
    const con = await getConnection();
    
    let userExists = (await checkIfUserExists(con, 'name', nameOrEmail)) ||
        (await checkIfUserExists(con, 'email', nameOrEmail));

    if (!userExists.length) 
        return res.json({ nameOrEmailError: true, msg: `There isn't any user registered with ${nameOrEmail}.` });

    const correctPassword = await comparePassword(password, userExists[0].password);
    if (correctPassword) 
        return res.json({ error: false, msg: 'You have logged in.' });

    res.json({ passwordError: true, msg: 'The password isn\'t correct.'});
}

async function checkIfUserExists(con, column, nameOrEmail) {
    const [userExists] = await con.execute(`SELECT * FROM users WHERE \`${column}\` = ?`, [nameOrEmail]);
    return userExists.length ? userExists : false;
}
const fetch = require('node-fetch');
const youtube = require('youtube-sr');
const { getConnection } = require('../../db/connect');

const URL_GOOGLE_SUGGEST = 'http://suggestqueries.google.com/complete/search?client=youtube&ds=yt&hl=es&q=';

module.exports = {
    searchVideoSuggestions,
    getVideos,
    register,
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
    
    const [rows] = await connection.execute('SELECT * from users where `email` = ?', [email]);

    if (rows.length) {
        return res.json({ error: true, msg: 'Same email registered.' });
    }

    await connection.execute('INSERT INTO users VALUES(NULL, ?, ?, ?)', [name, password, email])

    res.json({ error: false, msg: 'You have been registered.' });
}

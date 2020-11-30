const fetch = require('node-fetch');
const youtube = require('youtube-sr');

const URL_GOOGLE_SUGGEST = 'http://suggestqueries.google.com/complete/search?client=youtube&ds=yt&hl=es&q=';

module.exports = {
    searchVideoSuggestions,
    getVideos,
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

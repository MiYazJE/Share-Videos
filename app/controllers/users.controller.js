const fetch = require('node-fetch');
const youtubeScraper = require('../lib/youtubeScraper');

const URL_GOOGLE_SUGGEST =
    'http://suggestqueries.google.com/complete/search?client=youtube&ds=yt&hl=es&q=';

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
    if (!q) return res.status(400).json({ msg: 'Query is empty!' });
    const videos = await youtubeScraper.scrapVideosWithQuery(q);
    res.json([...videos]);
}

/*
    const { google } = require('googleapis');
    const { API_KEY } = process.env;
    const youtube = google.youtube('v3');

    const { clientID, clientSecret, callbackURL } = process.env;
    const auth = new google.auth.OAuth2(clientID, clientSecret, callbackURL);
    const youtube = google.youtube({ version: 'v3', auth });
*/

const fetch = require('node-fetch');

module.exports = {
    searchVideoSuggestions,
}

async function searchVideoSuggestions(req, res) {
    const { q } = req.params;
    const response    = await fetch(`http://suggestqueries.google.com/complete/search?client=youtube&ds=yt&hl=es&q=${q}`);
    const suggestions = mapSuggestions((await response.text()));
    res.json([...suggestions]);
}   

function mapSuggestions(suggestions) {
    const regexp = /(\[)\"(([a-z0-9])*(\ )?([a-z0-9])*)*/gi;
    return suggestions.match(regexp).map(w => w.substring(2));
}

/*
    const { google } = require('googleapis');
    const { API_KEY } = process.env;
    const youtube = google.youtube('v3');

    const { clientID, clientSecret, callbackURL } = process.env;
    const auth = new google.auth.OAuth2(clientID, clientSecret, callbackURL);
    const youtube = google.youtube({ version: 'v3', auth });
*/
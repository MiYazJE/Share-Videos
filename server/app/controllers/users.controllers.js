const { google } = require('googleapis');
const { API_KEY } = process.env;
const youtube = google.youtube('v3');

// const { clientID, clientSecret, callbackURL } = process.env;
// const auth = new google.auth.OAuth2(clientID, clientSecret, callbackURL);
// const youtube = google.youtube({ version: 'v3', auth });

module.exports = {
    searchVideoSuggestions,
    test: (req, res) => res.json({ youtube })
}

async function searchVideoSuggestions(req, res) {
    const { q, maxResults } = req.params;
    const { data } = await youtube.search.list({
        q,
        hl: 'es',
        maxResults,
        part: 'id,snippet',
        relevanceLanguage: 'es',
        key: API_KEY
    });
    res.json({ ...data });
}   
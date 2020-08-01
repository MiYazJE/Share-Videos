const router = require('express').Router();

const { google } = require('googleapis');
const youtube = google.youtube('v3');
const { API_KEY } = process.env;

router.get('/', (req, res) => res.json({ msg: 'Hola mundo!' }));

router.get('/youtube/search/:q', async (req, res) => {
    const { q } = req.params;
    const { data } = await youtube.search.list({
        q,
        part: 'snippet',
        key: API_KEY,
        type: 'video',
        order: 'viewCount'
    });
    res.json({ ...data });
});

module.exports = router;
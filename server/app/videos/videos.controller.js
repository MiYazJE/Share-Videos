const axios = require('axios');
const youtube = require('youtube-sr');

const URL_GOOGLE_SUGGEST = 'http://suggestqueries.google.com/complete/search?client=youtube&ds=yt&hl=es&q=';

function mapSuggestions(suggestions) {
  const regexp = /\["[\w\s]+"/gi;
  return suggestions.match(regexp).map((w) => w.substring(2, w.length - 1));
}

async function autocompleteYoutube(req, res) {
  const { q } = req.params;
  const response = await axios.get(`${URL_GOOGLE_SUGGEST}${q}`);
  const suggestions = mapSuggestions(await response.text());
  res.json([...suggestions]);
}

function mapVideos(videos) {
  return videos.map((video) => {
    const {
      durationFormatted: duration,
      url,
      views,
      title,
      thumbnail: { url: urlThumbnail },
      uploadedAt,
    } = video;
    return {
      url,
      views,
      title,
      urlThumbnail,
      uploadedAt,
      duration,
    };
  });
}

async function getYoutubeVideos(req, res) {
  const { q } = req.params;
  const videos = await youtube.search(q, { limit: 20 });
  return res.json(mapVideos(videos));
}

module.exports = {
  autocompleteYoutube,
  getYoutubeVideos,
};

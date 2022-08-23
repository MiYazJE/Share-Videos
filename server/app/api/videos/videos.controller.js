const youtube = require('youtube-sr');

const URL_GOOGLE_SUGGEST = 'http://suggestqueries.google.com/complete/search?client=youtube&ds=yt&hl=es&q=';

function mapSuggestions(suggestions) {
  if (!suggestions) return [];

  const regexp = /\["[\w\s]+"/gi;
  const suggestionsFiltered = suggestions
    .match(regexp)
    .map((w) => w.substring(2, w.length - 1));

  return new Set(suggestionsFiltered).values();
}

async function autocompleteYoutube(req, res) {
  const { q } = req.params;
  const response = await fetch(`${URL_GOOGLE_SUGGEST}${q}`);
  const suggestions = await response.text();
  const sanitizedSuggestions = mapSuggestions(suggestions);
  res.json([...sanitizedSuggestions]);
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
  const { offset = 0, limit = 10 } = req.query;

  const limitSearch = +offset + +limit;
  const videos = await youtube.search(q, { limit: limitSearch + 1 }) ?? [];
  const isLastPage = videos.length <= limitSearch;

  const paginatedVideos = videos.slice(offset, offset + limit);
  const data = mapVideos(paginatedVideos);

  return res.json({
    data,
    isLastPage,
  });
}

module.exports = {
  autocompleteYoutube,
  getYoutubeVideos,
};

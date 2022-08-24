const youtube = require('youtube-sr').default;

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

async function autocompleteYoutube(req, res) {
  const { q } = req.params;
  const suggestions = await youtube.getSuggestions(q);

  res.json(suggestions);
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

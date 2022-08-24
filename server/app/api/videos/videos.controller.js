const youtube = require('youtube-sr').default;

const YOUTUBE_CHANNEL_URL = 'https://www.youtube.com/c';

function mapVideos(videos) {
  return videos.map((video) => {
    const {
      durationFormatted: duration,
      url,
      views,
      title,
      thumbnail: { url: urlThumbnail },
      uploadedAt,
      channel,
    } = video;
    return {
      ...video,
      url,
      views,
      title,
      urlThumbnail,
      uploadedAt,
      duration,
      channel: {
        iconUrl: channel.icon.url,
        url: `${YOUTUBE_CHANNEL_URL}/${channel.name}`,
        name: channel.name,
      },
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

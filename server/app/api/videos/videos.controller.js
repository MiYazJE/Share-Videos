const youtube = require('youtube-sr').default;
const { UpstreamServiceError } = require('../../lib/errors');

const YOUTUBE_CHANNEL_URL = 'https://www.youtube.com/c';

function mapVideos(videos) {
  if (!Array.isArray(videos)) return [];

  return videos.reduce((mappedVideos, video) => {
    if (!video?.url || !video?.title || !video?.thumbnail?.url || !video?.channel?.name) {
      return mappedVideos;
    }

    mappedVideos.push({
      ...video,
      url: video.url,
      views: video.views,
      title: video.title,
      urlThumbnail: video.thumbnail.url,
      uploadedAt: video.uploadedAt,
      duration: video.durationFormatted,
      channel: {
        iconUrl: video.channel.icon?.url ?? null,
        url: `${YOUTUBE_CHANNEL_URL}/${video.channel.name}`,
        name: video.channel.name,
      },
    });

    return mappedVideos;
  }, []);
}

async function autocompleteYoutube(req, res) {
  const { q } = req.params;
  let suggestions;
  try {
    suggestions = await youtube.getSuggestions(q);
  } catch (error) {
    throw new UpstreamServiceError('YouTube search is temporarily unavailable', {
      cause: error,
    });
  }

  return res.json(suggestions);
}

async function getYoutubeVideos(req, res) {
  const { q } = req.params;
  const { offset = 0, limit = 10 } = req.query;

  const limitSearch = +offset + +limit;
  let videos;
  try {
    videos = await youtube.search(q, { limit: limitSearch + 1 }) ?? [];
  } catch (error) {
    throw new UpstreamServiceError('YouTube search is temporarily unavailable', {
      cause: error,
    });
  }
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

const request = require('supertest');

const mockSearch = jest.fn();
const mockGetSuggestions = jest.fn();

jest.mock('youtube-sr', () => ({
  default: {
    search: mockSearch,
    getSuggestions: mockGetSuggestions,
  },
}));

const app = require('../../../app');

const validVideo = {
  durationFormatted: '1:23',
  url: 'https://youtube.test/watch?v=valid',
  views: 42,
  title: 'Valid video',
  thumbnail: { url: 'https://youtube.test/thumb.jpg' },
  uploadedAt: 'today',
  channel: {
    name: 'channel',
    icon: { url: 'https://youtube.test/icon.jpg' },
  },
};

describe('YouTube video API resilience', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => jest.restoreAllMocks());

  test('keeps valid results and omits malformed records', async () => {
    mockSearch.mockResolvedValue([validVideo, { title: 'missing nested fields' }]);

    const response = await request(app).get('/videos/youtube/music');

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0]).toMatchObject({
      title: validVideo.title,
      urlThumbnail: validVideo.thumbnail.url,
      duration: validVideo.durationFormatted,
      channel: {
        name: validVideo.channel.name,
        iconUrl: validVideo.channel.icon.url,
      },
    });
    expect(typeof response.body.isLastPage).toBe('boolean');
  });

  test('returns an empty successful page when all records are malformed', async () => {
    mockSearch.mockResolvedValue([{ title: 'invalid' }]);

    const response = await request(app).get('/videos/youtube/music');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ data: [], isLastPage: true });
  });

  test('contains a search rejection and serves a later request', async () => {
    mockSearch
      .mockRejectedValueOnce(new TypeError('browseId parser failure'))
      .mockResolvedValueOnce([validVideo]);

    const failure = await request(app).get('/videos/youtube/music');
    const success = await request(app).get('/videos/youtube/music');

    expect(failure.status).toBe(502);
    expect(failure.body).toEqual({ message: 'YouTube search is temporarily unavailable' });
    expect(success.status).toBe(200);
  });

  test('contains autocomplete rejection and preserves successful shape', async () => {
    mockGetSuggestions
      .mockRejectedValueOnce(new Error('upstream failed'))
      .mockResolvedValueOnce(['music one', 'music two']);

    const failure = await request(app).get('/videos/autocomplete/youtube/music');
    const success = await request(app).get('/videos/autocomplete/youtube/music');

    expect(failure.status).toBe(502);
    expect(success.status).toBe(200);
    expect(success.body).toEqual(['music one', 'music two']);
  });
});

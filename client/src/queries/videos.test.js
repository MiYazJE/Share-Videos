/* eslint-disable import/first, object-curly-newline, prefer-destructuring */
import {
  describe, expect, it, vi,
} from 'vitest';

const { getVideoSuggestions, searchVideos } = vi.hoisted(() => ({
  getVideoSuggestions: vi.fn(),
  searchVideos: vi.fn(),
}));

vi.mock('src/api/videos', () => ({
  getVideoSuggestions,
  searchVideos,
  normalizeSearch: (search = '') => search.trim(),
}));

import { videoSearchOptions, videoSuggestionsOptions } from './videos';

describe('video query options', () => {
  it('disables autocomplete for empty normalized input', () => {
    expect(videoSuggestionsOptions('   ').enabled).toBe(false);
  });

  it('keys searches by normalized input and pagination', () => {
    expect(videoSearchOptions({ search: ' ambient ', limit: 10, offset: 20 }).queryKey)
      .toEqual(['videos', { search: 'ambient', limit: 10, offset: 20 }]);
  });

  it('forwards cancellation signals to search requests', async () => {
    searchVideos.mockResolvedValueOnce({ data: [], isLastPage: true });
    const signal = new AbortController().signal;
    const options = videoSearchOptions({ search: 'ambient', limit: 10, offset: 0 });
    await options.queryFn({ signal });
    expect(searchVideos).toHaveBeenCalledWith({ search: 'ambient', limit: 10, offset: 0, signal });
  });

  it('keeps prior page data while another page loads', () => {
    const previous = { data: [{ id: 'video-1' }], isLastPage: false };
    expect(videoSearchOptions({ search: 'ambient' }).placeholderData(previous)).toBe(previous);
  });
});

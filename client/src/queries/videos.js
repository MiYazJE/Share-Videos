import { keepPreviousData, queryOptions } from '@tanstack/react-query';
import { getVideoSuggestions, normalizeSearch, searchVideos } from 'src/api/videos';
import { queryKeys } from './keys';

export const videoSuggestionsOptions = (search) => {
  const normalizedSearch = normalizeSearch(search);
  return queryOptions({
    queryKey: queryKeys.suggestions(normalizedSearch),
    queryFn: ({ signal }) => getVideoSuggestions({ search: normalizedSearch, signal }),
    enabled: Boolean(normalizedSearch),
    staleTime: 60 * 1000,
  });
};

export const videoSearchOptions = ({ search, limit = 10, offset = 0 }) => {
  const normalizedSearch = normalizeSearch(search);
  return queryOptions({
    queryKey: queryKeys.videos(normalizedSearch, limit, offset),
    queryFn: ({ signal }) => searchVideos({
      search: normalizedSearch, limit, offset, signal,
    }),
    enabled: Boolean(normalizedSearch),
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
  });
};

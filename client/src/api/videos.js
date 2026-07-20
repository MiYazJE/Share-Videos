import { API_ROUTES } from 'src/enums';
import { HttpInstance } from 'src/utils';

const http = new HttpInstance();

export const normalizeSearch = (search = '') => search.trim();

export const searchVideos = ({
  search, limit = 10, offset = 0, signal,
}) => http.get(
  `${API_ROUTES.VIDEOS.GET_VIDEOS}/${encodeURIComponent(normalizeSearch(search))}`,
  { params: { limit, offset }, signal },
);

export const getVideoSuggestions = ({ search, signal }) => http.get(
  `${API_ROUTES.VIDEOS.SUGGESTED_VIDEOS}/${encodeURIComponent(normalizeSearch(search))}`,
  { signal },
);

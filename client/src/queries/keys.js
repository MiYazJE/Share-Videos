export const queryKeys = {
  session: ['session'],
  room: (id) => ['room-validation', id],
  videos: (search, limit, offset) => ['videos', { search, limit, offset }],
  suggestions: (search) => ['video-suggestions', search],
};

export const INITIAL_ROOM_STATE = {
  id: '',
  host: '',
  users: [],
  queue: [],
  isPlaying: false,
  seekVideo: false,
  progressVideo: 0,
  currentVideo: {
    id: null,
    url: '',
    title: '',
    views: null,
    updatedAt: null,
  },
  chat: [],
};

export const roomReducer = (state, action) => {
  switch (action.type) {
    case 'room/updated': return { ...state, ...action.payload };
    case 'chat/updated': return { ...state, chat: action.payload };
    case 'seek/handled': return { ...state, seekVideo: false };
    case 'room/reset': return INITIAL_ROOM_STATE;
    default: return state;
  }
};

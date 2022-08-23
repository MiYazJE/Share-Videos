import { API_ROUTES, ROOM_MODALS } from 'src/enums';
import { HttpInstance } from 'src/utils';

const http = new HttpInstance();

const INITIAL_STATE = {
  id: '',
  host: '',
  users: [],
  queue: [],
  suggestedVideos: [],
  videos: [],
  loadingRoom: false,
  loadingVideos: false,
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
  avtiveModal: ROOM_MODALS.NONE,
  videoSearch: '',
};

export default {
  state: INITIAL_STATE,
  reducers: {
    SET_PROP: (state, payload) => ({ ...state, ...payload }),
  },
  effects: (dispatch) => ({
    async createRoom(name) {
      const room = await http.post(API_ROUTES.ROOM.CREATE_ROOM, { name });
      dispatch.room.SET_PROP(room);
      dispatch.user.SET_NAME(name);
      return room.id;
    },
    async getSuggestedVideos(query) {
      if (!query) {
        dispatch.room.SET_PROP({ suggestedVideos: [] });
        return;
      }
      const suggestedVideos = await http.get(`${API_ROUTES.VIDEOS.SUGGESTED_VIDEOS}/${query}`);
      dispatch.room.SET_PROP({ suggestedVideos });
    },
    async getVideos({ limit = 10, offset = 0 } = {}, state) {
      const { videoSearch } = state.room;

      const sanitizedSearch = videoSearch.trim();
      if (!sanitizedSearch) return;

      const { data: videos, isLastPage } = await http.get(`${API_ROUTES.VIDEOS.GET_VIDEOS}/${sanitizedSearch}`, {
        params: { limit, offset },
      });

      dispatch.room.getSuggestedVideos(sanitizedSearch);
      dispatch.room.SET_PROP({ videos, isLastPage });
    },
  }),
};

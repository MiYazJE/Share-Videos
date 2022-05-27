import { WS_MESSAGES, API_ROUTES } from 'src/enums';
import { HttpInstance } from 'src/utils';

const {
  WS_VIEW_VIDEO,
  WS_JOIN_ROOM,
  WS_ADD_VIDEO,
  WS_REMOVE_VIDEO,
  WS_SEND_PLAYER_STATE,
  WS_SEND_PROGRESS,
  WS_SEND_MESSAGE,
} = WS_MESSAGES;

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
    async getVideos(search) {
      dispatch.room.getSuggestedVideos(search);
      const videos = await http.get(`${API_ROUTES.VIDEOS.GET_VIDEOS}/${search}`);
      dispatch.room.SET_PROP({ videos });
    },

    joinRoom(payload) {
      dispatch({
        type: WS_JOIN_ROOM,
        payload,
      });
    },
    enqueueVideo(payload) {
      dispatch({
        type: WS_ADD_VIDEO,
        payload,
      });
    },
    removeVideo(payload) {
      dispatch({
        type: WS_REMOVE_VIDEO,
        payload,
      });
    },
    viewVideo(payload) {
      dispatch({
        type: WS_VIEW_VIDEO,
        payload,
      });
    },
    sendPlayerState(payload) {
      dispatch({
        type: WS_SEND_PLAYER_STATE,
        payload,
      });
    },
    sendProgress(payload) {
      dispatch({
        type: WS_SEND_PROGRESS,
        payload,
      });
    },
    sendMessage(payload) {
      dispatch({
        type: WS_SEND_MESSAGE,
        payload,
      });
    },
  }),
};

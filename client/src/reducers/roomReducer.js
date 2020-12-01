import { 
    SET_ROOM,
    SET_VIDEOS,
    SET_LOADING_VIDEOS,
    SET_SUGGESTED_VIDEOS,
    SET_URL_VIDEO,
    SET_PLAY_VIDEO,
    SET_SEEK_VIDEO,
    SET_IS_PLAYING
} from '../actions/actionTypes';

const initialState = {
    id: '',
    host: '',
    urlVideo: '',
    users: [],
    queue: [],
    suggestedVideos: [],
    videos: [],
    loading: false,
    loadingVideos: false,
    isPlaying: false,
    seekVideo: false,
    progressVideo: 0,
    currentVideo: {
        id: null,
        url: '',
        title: '',
        views: null,
        updatedAt: null
    },
    chat: []
};

const roomReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_ROOM:
            return { ...state, ...action.room };
        case SET_VIDEOS:
            return { ...state, videos: action.videos };
        case SET_IS_PLAYING:
            return { ...state, isPlaying: action.isPlaying };
        case SET_LOADING_VIDEOS:
            return { ...state, loadingVideos: action.loading };
        case SET_SUGGESTED_VIDEOS:
            return { ...state, suggestedVideos: action.suggestedVideos };
        case SET_URL_VIDEO:
            return { ...state, urlVideo: action.url };
        case SET_PLAY_VIDEO:
            return { ...state, ...action.payload, isPlaying: true };
        case SET_SEEK_VIDEO:
            return { ...state, seekVideo: action.seekVideo };
        default:
            return { ...state };
    }
};

export const readRoom            = (state) => ({ ...state.roomReducer.room });
export const readRoomName        = (state) => state.roomReducer.id;
export const readUsers           = (state) => state.roomReducer.users;
export const readQueue           = (state) => state.roomReducer.queue;
export const readHost            = (state) => state.roomReducer.host;
export const readIsLoading       = (state) => state.roomReducer.loading;
export const readLoadingVideos   = (state) => state.roomReducer.loadingVideos;
export const readUrlVideo        = (state) => state.roomReducer.currentVideo.url;
export const readSuggestedVideos = (state) => state.roomReducer.suggestedVideos;
export const readVideos          = (state) => state.roomReducer.videos;
export const readCurrentVideoId  = (state) => state.roomReducer.currentVideo.id;
export const readIsPlaying       = (state) => state.roomReducer.isPlaying;
export const readSeekVideo       = (state) => state.roomReducer.seekVideo;
export const readProgress        = (state) => state.roomReducer.progressVideo;
export const readTitle           = (state) => state.roomReducer.currentVideo.title;
export const readCurrentVideo    = (state) => state.roomReducer.currentVideo;
export const readChat            = (state) => state.roomReducer.chat;

export default roomReducer;

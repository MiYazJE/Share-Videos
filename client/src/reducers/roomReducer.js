import { 
    SET_ROOM,
    SET_VIDEOS,
    SET_LOADING_VIDEOS,
    SET_SUGGESTED_VIDEOS,
    SET_URL_VIDEO,
} from '../actions/actionTypes';

const initialState = {
    id: '',
    host: '',
    users: [],
    queue: [],
    suggestedVideos: [],
    videos: [],
    loading: false,
    urlVideo: 'https://www.youtube.com/watch?v=A1xEete-zHM',
    loadingVideos: false,
};

const roomReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_ROOM:
            return { ...state, ...action.room };
        case SET_VIDEOS:
            return { ...state, videos: action.videos };
        case SET_LOADING_VIDEOS:
            return { ...state, loadingVideos: action.loading };
        case SET_SUGGESTED_VIDEOS:
            return { ...state, suggestedVideos: action.suggestedVideos };
        case SET_URL_VIDEO:
            return { ...state, urlVideo: action.url };
        default:
            return { ...state };
    }
};

export const readRoom = (state) => ({ ...state.roomReducer.room });
export const readRoomName = (state) => state.roomReducer.id;
export const readUsers = (state) => state.roomReducer.users;
export const readQueue = (state) => state.roomReducer.queue;
export const readHost = (state) => state.roomReducer.host;
export const readIsLoading = (state) => state.roomReducer.loading;
export const readLoadingVideos = (state) => state.roomReducer.loadingVideos;
export const readUrlVideo = (state) => state.roomReducer.urlVideo;
export const readSuggestedVideos = (state) => state.roomReducer.suggestedVideos;
export const readVideos = (state) => state.roomReducer.videos;

export default roomReducer;

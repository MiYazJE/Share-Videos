import {
    SET_IS_LOGGED,
    SET_NAME,
    SET_SUGGESTED_VIDEOS,
    SET_LOADING_VIDEOS,
    SET_VIDEOS,
    SET_URL_VIDEO,
} from '../actions/actionTypes';

const initialState = {
    isLogged: false,
    name: '',
    urlVideo: 'https://www.youtube.com/watch?v=A1xEete-zHM',
    loadingVideos: false,
    suggestedVideos: [],
    videos: []
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_IS_LOGGED:
            return { ...state, isLogged: action.isLogged };
        case SET_NAME:
            return { ...state, name: action.name };
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

export const readUser = (state) => ({ ...state.userReducer });
export const readName = () => window.localStorage.getItem('name');
export const readIsLogged = (state) => state.userReducer.isLogged;
export const readUrlVideo = (state) => state.userReducer.urlVideo;
export const readLoadingVideos = (state) => state.userReducer.loadingVideos;
export const readSuggestedVideos = (state) => state.userReducer.suggestedVideos;
export const readVideos = (state) => state.userReducer.videos;

export default reducer;

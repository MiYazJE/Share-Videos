import api from '../Http/api';
import { 
    SET_ROOM,
    SET_LOADING,
    SET_LOADING_VIDEOS,
    WS_JOIN_ROOM,
    SET_URL_VIDEO,
    SET_SUGGESTED_VIDEOS,
    SET_VIDEOS
} from './actionTypes';

export const setRoom = (room) => ({
    type: SET_ROOM,
    room
});

const setLoadingVideos = (loading) =>({
    type: SET_LOADING_VIDEOS,
    loading
});

export const setUrlVideo = (url) => ({
    type: SET_URL_VIDEO,
    url,
});

const setLoading = (loading) => ({
    type: SET_LOADING,
    loading
});

const setSuggestedVideos = (suggestedVideos) => ({
    type: SET_SUGGESTED_VIDEOS,
    suggestedVideos,
});

const setVideos = (videos) => ({
    type: SET_VIDEOS,
    videos,
});

export const createRoom = (host, cb) => async (dispatch) => {
    const room = await api.createRoom(host);
    dispatch(setRoom(room));
    cb(room.id);
};

export const isValidRoom = (id, redirect) => async (dispatch) => {
    dispatch(setLoading(true));
    const isValid = await api.isValidRoom(id);
    if (!isValid) redirect();

    dispatch(setLoading(false));
};

export const getSuggestedVideos = (query) => async (dispatch) => {
    if (!query) {
        dispatch(setSuggestedVideos([]));
        return;
    }
    const suggestedVideos = await api.searchVideoSuggestions(query);
    dispatch(setSuggestedVideos([...suggestedVideos]));
};

export const getVideos = (searched, callback) => async (dispatch) => {
    dispatch(setLoadingVideos(true));
    dispatch(getSuggestedVideos(searched));
    const videos = await api.searchYoutubeVideos(searched);
    dispatch(setVideos(videos));
    dispatch(setLoadingVideos(false));
    callback();
};

export const joinRoom = (payload) => ({
    type: WS_JOIN_ROOM,
    payload
});
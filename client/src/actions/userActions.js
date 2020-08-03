import { SET_LOADING_VIDEOS, SET_VIDEOS, SET_SUGGESTED_VIDEOS, SET_URL_VIDEO } from './actionTypes';
import api from '../Http/api';

export const setUrlVideo = (url) => ({
    type: SET_URL_VIDEO,
    url,
});

export const setLoadingVideos = (loading) => ({
    type: SET_LOADING_VIDEOS,
    loading,
});

const setSuggestedVideos = (suggestedVideos) => ({
    type: SET_SUGGESTED_VIDEOS,
    suggestedVideos,
});

const setVideos = (videos) => ({
    type: SET_VIDEOS,
    videos,
});

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
    callback();
    dispatch(setLoadingVideos(false));
};

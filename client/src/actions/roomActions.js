import api from '../Http/api';
import {
  SET_ROOM,
  SET_LOADING_ROOM,
  SET_LOADING_VIDEOS,
  SET_URL_VIDEO,
  SET_SUGGESTED_VIDEOS,
  SET_VIDEOS,
  SET_PLAY_VIDEO,
  SET_SEEK_VIDEO,
  SET_IS_PLAYING,
  SET_CHAT,
  WS_ADD_VIDEO,
  WS_REMOVE_VIDEO,
  WS_VIEW_VIDEO,
  WS_SEND_PLAYER_STATE,
  WS_JOIN_ROOM,
  WS_SEND_PROGRESS,
  WS_SEND_MESSAGE,
} from './actionTypes';

export const setRoom = (payload) => ({
  type: SET_ROOM,
  payload,
});

const setLoadingVideos = (loading) => ({
  type: SET_LOADING_VIDEOS,
  loading,
});

export const setUrlVideo = (url) => ({
  type: SET_URL_VIDEO,
  url,
});

const setLoadingRoom = (loading) => ({
  type: SET_LOADING_ROOM,
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

export const setPlayVideo = (payload) => ({
  type: SET_PLAY_VIDEO,
  payload,
});

export const setSeekVideo = (seekVideo) => ({
  type: SET_SEEK_VIDEO,
  seekVideo,
});

export const setIsPlaying = (isPlaying) => ({
  type: SET_IS_PLAYING,
  isPlaying,
});

export const setChat = (chat) => ({
  type: SET_CHAT,
  chat,
});

/* ASYNC API CALLS */
export const createRoom = (host, cb) => async (dispatch) => {
  const room = await api.createRoom(host);
  dispatch(setRoom(room));
  cb(room.id);
};

export const isValidRoom = (id, cbFailure, cbSuccess) => async (dispatch) => {
  dispatch(setLoadingRoom(true));

  const isValid = await api.isValidRoom(id);
  if (!isValid) cbFailure();
  else cbSuccess?.();

  dispatch(setLoadingRoom(false));
};

export const getSuggestedVideos = (query) => async (dispatch) => {
  if (!query) {
    dispatch(setSuggestedVideos([]));
    return;
  }
  const suggestedVideos = await api.searchVideoSuggestions(query);
  dispatch(setSuggestedVideos([...suggestedVideos]));
};

export const getVideos = (searched) => async (dispatch) => {
  dispatch(setLoadingVideos(true));
  dispatch(getSuggestedVideos(searched));
  const videos = await api.searchYoutubeVideos(searched);
  dispatch(setVideos(videos));
  dispatch(setLoadingVideos(false));
};

/* WEB SOCKETS */
export const joinRoom = (payload) => ({
  type: WS_JOIN_ROOM,
  payload,
});

export const enqueueVideo = (payload) => ({
  type: WS_ADD_VIDEO,
  payload,
});

export const removeVideo = (payload) => ({
  type: WS_REMOVE_VIDEO,
  payload,
});

export const viewVideo = (payload) => ({
  type: WS_VIEW_VIDEO,
  payload,
});

export const sendPlayerState = (payload) => ({
  type: WS_SEND_PLAYER_STATE,
  payload,
});

export const sendProgress = (payload) => ({
  type: WS_SEND_PROGRESS,
  payload,
});

export const sendMessage = (payload) => ({
  type: WS_SEND_MESSAGE,
  payload,
});

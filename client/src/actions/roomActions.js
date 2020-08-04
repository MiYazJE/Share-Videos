import api from '../Http/api';
import { SET_ROOM, SET_LOADING } from './actionTypes';

export const setRoom = (room) => ({
    type: SET_ROOM,
    room
});

const setLoading = (loading) => ({
    type: SET_LOADING,
    loading
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
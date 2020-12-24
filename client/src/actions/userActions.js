import { SET_NAME, SET_LOADING } from './actionTypes';
import API from '../Http/api';

export const setName = (name) => {
    window.localStorage.setItem('name', name);
    return {
        type: SET_NAME,
        name,
    }
};

export const setLoading = (loading) => ({
    type: SET_LOADING,
    loading,
});


// ASYNC ACTIONS
export const register = (payload) => async (dispatch) => {
    dispatch(setLoading(true));
    const res = await API.register(payload);
    dispatch(setLoading(false));
    return res;
}

export const login = (payload) => async (dispatch) => {
    dispatch(setLoading(true));
    const res = await API.login(payload);
    dispatch(setLoading(false));
    return res;
}
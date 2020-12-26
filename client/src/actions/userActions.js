import { SET_NAME, SET_LOGGED_IN, SET_LOADING_USER } from './actionTypes';
import API from '../Http/api';

export const setName = (name) => {
    return {
        type: SET_NAME,
        name,
    };
};

export const setLoadingUser = (loading) => ({
    type: SET_LOADING_USER,
    loading,
});

export const setLoggedIn = (payload) => ({
    type: SET_LOGGED_IN,
    payload,
});

// ASYNC ACTIONS
export const register = (payload) => async (dispatch) => {
    const res = await API.register(payload);
    return res;
};

export const login = (payload) => async (dispatch) => {
    const res = await API.login(payload);
    if (res.user) dispatch(setLoggedIn(res.user));
    return res.info;
};

export const whoAmI = () => async (dispatch) => {
    dispatch(setLoadingUser(true));
    const res = await API.whoAmI();
    dispatch(setLoadingUser(false));
    if (res && res.user) dispatch(setLoggedIn(res.user));
};

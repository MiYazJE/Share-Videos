import { SET_NAME, SET_LOADING, SET_LOGGED_IN } from './actionTypes';
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

export const setLoggedIn = (payload) => ({
    type: SET_LOGGED_IN,
    payload,
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
    if (res.user) dispatch(setLoggedIn(res.user));
    return res.info;
}

export const whoAmI = () => async (dispatch) => {
    dispatch(setLoading(true));
    const res = await API.whoAmI();
    if (res.user) dispatch(setLoggedIn(res.user));
    dispatch(setLoading(false));
}
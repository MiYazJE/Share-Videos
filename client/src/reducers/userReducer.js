import {
    SET_NAME,
    SET_LOGGED_IN,
    SET_LOADING
} from '../actions/actionTypes';

const initialState = {
    isLogged: false,
    name: window.localStorage.getItem('name') || '',
    loading: false,
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_NAME:
            return { ...state, name: action.name };
        case SET_LOGGED_IN:
            return { ...state, ...action.payload };
        case SET_LOADING:
            return { ...state, loading: action.isLoading };
        default:
            return { ...state };
    }
};

export const readUser      = (state) => ({ ...state.userReducer });
export const readName      = (state) => window.localStorage.getItem('name');
export const readIsLogged  = (state) => state.userReducer.isLogged;
export const readIsLoading = (state) => state.userReducer.loading;

export default reducer;

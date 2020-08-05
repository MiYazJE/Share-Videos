import {
    SET_IS_LOGGED,
    SET_NAME,
} from '../actions/actionTypes';

const initialState = {
    isLogged: false,
    name: window.localStorage.getItem('name') || '',
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_IS_LOGGED:
            return { ...state, isLogged: action.isLogged };
        case SET_NAME:
            return { ...state, name: action.name };
        default:
            return { ...state };
    }
};

export const readUser = (state) => ({ ...state.userReducer });
export const readName = () => window.localStorage.getItem('name');
export const readIsLogged = (state) => state.userReducer.isLogged;

export default reducer;

import {
    SET_NAME,
    SET_LOGGED_IN,
    SET_LOADING_USER,
    SET_IS_LOADING,
    LOGOUT,
    SET_FORM_ERRORS,
    CLEAR_FORM_ERRORS,
} from '../actions/actionTypes';

const initialFormErrors = {
    errorName: false,
    errorPassword: false,
    errorEmail: false,
};

const initialState = {
    isLogged: false,
    name: '',
    loadingUser: false,
    isLoading: false,
    formErrors: initialFormErrors,
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_NAME:
            return { ...state, name: action.name };
        case SET_LOGGED_IN:
            return { ...state, name: action.payload.name, isLogged: true };
        case SET_LOADING_USER:
            return { ...state, loadingUser: action.loadingUser };
        case SET_IS_LOADING:
            return { ...state, isLoading: action.isLoading };
        case SET_FORM_ERRORS:
            return { ...state, formErrors: action.formErrors };
        case CLEAR_FORM_ERRORS:
            return { ...state, formErrors: initialFormErrors };
        case LOGOUT:
            return { ...initialState };
        default:
            return { ...state };
    }
};

export const readUser = (state) => ({ ...state.userReducer });
export const readName = (state) => state.userReducer.name;
export const readIsLogged = (state) => state.userReducer.isLogged;
export const readIsLoading = (state) => state.userReducer.isLoading;
export const readIsLoadingUser = (state) => state.userReducer.loadingUser;
export const readFormErrors = (state) => state.userReducer.formErrors;

export default reducer;

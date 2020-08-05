import { SET_NAME } from './actionTypes';

export const setName = (name) => {
    window.localStorage.setItem('name', name);
    return {
        type: SET_NAME,
        name,
    }
};
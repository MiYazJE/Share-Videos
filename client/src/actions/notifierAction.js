import { ADD_NOTIFICATION } from './actionTypes';

export const addNotification = (notification) => ({
    type: ADD_NOTIFICATION,
    notification,
});

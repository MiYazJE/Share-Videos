import { ADD_NOTIFICATION } from '../actions/actionTypes';

export default (state = { notification: null }, action) => {
    switch (action.type) {
        case ADD_NOTIFICATION:
            return { notification: action.notification };
        default:
            return state;
    }
};

export const readNotification = (state) => state.notifierReducer.notification;

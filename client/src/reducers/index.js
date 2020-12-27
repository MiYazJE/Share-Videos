import { combineReducers } from 'redux';
import userReducer from './userReducer';
import roomReducer from './roomReducer';
import notifierReducer from './notifierReducer';
import modalReducer from './modalReducer';

export default combineReducers({
    userReducer,
    roomReducer,
    notifierReducer,
    modalReducer,
});

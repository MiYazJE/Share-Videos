import { combineReducers } from 'redux';
import userReducer from './userReducer';
import roomReducer from './roomReducer';
import notifierReducer from './notifierReducer';

export default combineReducers({
    userReducer,
    roomReducer,
    notifierReducer,
});

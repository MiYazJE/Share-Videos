import { SET_ROOM } from '../actions/actionTypes'

const initialState = {
    id: '',
    users: [],
    host: '',
    queue: [],
    loading: false,
};

const roomReducer = (state = initialState, action) => {
    switch(action.type) {
        case SET_ROOM: 
            return { ...action.room };
        default: 
            return { ...state };
    }
}

export const readRoom = (state) => ({ ...state.roomReducer.room });
export const readRoomName = (state) => state.roomReducer.id;
export const readUsers = (state) => state.roomReducer.users;
export const readHost = (state) => state.roomReducer.host;
export const readIsLoading = (state) => state.roomReducer.loading;

export default roomReducer;
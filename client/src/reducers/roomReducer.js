import { SET_ROOM } from '../actions/actionTypes'

const initialState = {};

const roomReducer = (state = initialState, action) => {
    switch(action.type) {
        case SET_ROOM: 
            return { ...action.room };
        default: 
            return { ...state };
    }
}

export const readRoom = (state) => ({ ...state.roomReducer.room });

export default roomReducer;
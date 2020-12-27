import { SET_OPEN_LOGIN, SET_OPEN_REGISTER, SET_CLOSE_MODAL } from '../actions/actionTypes';

const MODAL_STATUS_TYPES = {
    LOGIN: 'LOGIN',
    REGISTER: 'REGISTER',
    CLOSED: 'CLOSED',
}

const initialState = {
    status: MODAL_STATUS_TYPES.CLOSED
};

export default (state = initialState, action) => {
    switch (action.type) {
        case SET_OPEN_LOGIN:
            return { status: MODAL_STATUS_TYPES.LOGIN };
        case SET_OPEN_REGISTER:
            return { status: MODAL_STATUS_TYPES.REGISTER };
        case SET_CLOSE_MODAL:
            return { status: MODAL_STATUS_TYPES.CLOSED };
        default: 
            return state;
    }
};

export const readStatus = (state) => state.modalReducer.status;
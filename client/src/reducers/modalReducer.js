import { SET_OPEN_LOGIN, SET_OPEN_REGISTER, SET_CLOSE_MODAL } from '../actions/actionTypes';

export const MODAL_STATUS = {
  LOGIN: 'LOGIN',
  REGISTER: 'REGISTER',
  CLOSED: 'CLOSED',
};

const initialState = {
  status: MODAL_STATUS.CLOSED,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_OPEN_LOGIN:
      return { status: MODAL_STATUS.LOGIN };
    case SET_OPEN_REGISTER:
      return { status: MODAL_STATUS.REGISTER };
    case SET_CLOSE_MODAL:
      return { status: MODAL_STATUS.CLOSED };
    default:
      return state;
  }
};

export const readStatus = (state) => state.modalReducer.status;

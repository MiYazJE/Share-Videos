import { SET_OPEN_LOGIN, SET_OPEN_REGISTER, SET_CLOSE_MODAL } from './actionTypes';

export const openLogin = () => ({
  type: SET_OPEN_LOGIN,
});

export const openRegister = () => ({
  type: SET_OPEN_REGISTER,
});

export const closeModal = () => ({
  type: SET_CLOSE_MODAL,
});

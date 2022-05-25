import {
  SET_NAME,
  SET_LOGGED_IN,
  SET_LOADING_USER,
  SET_IS_LOADING,
  LOGOUT,
  SET_FORM_ERRORS,
  CLEAR_FORM_ERRORS,
} from './actionTypes';
import addNotification from './notifierAction';
import api from '../Http/api';
import { closeModal } from './modalActions';

export const setName = (name) => ({
  type: SET_NAME,
  name,
});

export const setLoadingUser = (loadingUser) => ({
  type: SET_LOADING_USER,
  loadingUser,
});

export const setLoggedIn = (payload) => ({
  type: SET_LOGGED_IN,
  payload,
});

export const setLoading = (isLoading) => ({
  type: SET_IS_LOADING,
  isLoading,
});

export const setFormErrors = (errorName, errorEmail, errorPassword) => ({
  type: SET_FORM_ERRORS,
  formErrors: { errorName, errorEmail, errorPassword },
});

export const clearFormErrors = () => ({
  type: CLEAR_FORM_ERRORS,
});

export const setLogout = () => ({ type: LOGOUT });

// ASYNC ACTIONS
export const register = (payload, callback) => async (dispatch) => {
  const { name, email, password } = payload;
  dispatch(setFormErrors(!name, !email, !password));
  if (!name || !email || !password) { return dispatch(addNotification({ msg: 'Fields cannot be empty.', variant: 'error' })); }

  dispatch(setLoading(true));
  const {
    error, nameError, emailError, msg,
  } = await api.register(payload);
  dispatch(addNotification({ msg, variant: !error ? 'success' : 'error' }));

  if (!error) callback();
  dispatch(setFormErrors(nameError, emailError, false));
  dispatch(setLoading(false));
};

export const whoAmI = () => async (dispatch) => {
  dispatch(setLoadingUser(true));
  const res = await api.whoAmI();
  dispatch(setLoadingUser(false));
  if (res && res.user) dispatch(setLoggedIn(res.user));
};

export const logout = () => async (dispatch) => {
  await api.logout();
  dispatch(setLogout());
  dispatch(addNotification({ msg: 'You have logged out.', variant: 'error' }));
};

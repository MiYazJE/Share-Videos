import { ADD_NOTIFICATION } from './actionTypes';

const addNotification = (notification) => ({
  type: ADD_NOTIFICATION,
  notification,
});

export default {
  addNotification,
};

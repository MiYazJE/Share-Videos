const INITIAL_STATE = {
  notification: null,
};

export default {
  state: INITIAL_STATE,
  reducers: {
    ADD_NOTIFICATION(state, payload) {
      return { ...state, notification: payload };
    },
    CLEAR_NOTIFICATION() {
      return { notification: null };
    },
  },
};

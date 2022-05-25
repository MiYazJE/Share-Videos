import { HttpInstance } from '../utils';
import { API_ROUTES } from '../enums';

const http = new HttpInstance();

const INITIAL_STATE = {
  isLogged: false,
  name: '',
};

export default {
  state: INITIAL_STATE,
  reducers: {
    SET_PROP: (state, payload) => ({ ...state, ...payload }),
    SET_NAME: (state, payload) => ({ ...state, name: payload }),
  },
  effects: (dispatch) => ({
    async register(payload) {
      const res = await http.post(API_ROUTES.REGISTER, payload);
      console.log({ request: res });
    },
    async login(payload) {
      try {
        const { user } = await http.post(API_ROUTES.LOGIN, payload);
        dispatch.notifier.ADD_NOTIFICATION({ msg: 'Logged in successfully', variant: 'success' });
        dispatch.user.SET_PROP({ name: user.name, isLogged: true });
      } catch (err) {
        const { msg } = err.response.data;
        dispatch.notifier.ADD_NOTIFICATION({ msg, variant: 'error' });
      }
    },
    async logout() {
      await http.get(API_ROUTES.LOGOUT);
    },
    async whoAmI() {
      const res = await http.get(API_ROUTES.WHO_AM_I);
      console.log({ res });
    },
  }),
};

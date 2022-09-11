import { HttpInstance } from 'src/utils';
import { API_ROUTES } from 'src/enums';
import tokenStorage from 'src/utils/token-storage';

const http = new HttpInstance();

const DEFAULT_COLOR = 'rgb(169 30 7 / 80%)';

const mapLoggedUser = (user) => ({
  name: user.name,
  avatarBase64: user.avatarBase64,
  id: user.id,
  isLogged: true,
  color: user.color,
});

const INITIAL_STATE = {
  isLogged: false,
  name: '',
  color: DEFAULT_COLOR,
  avatarBase64: '',
  id: null,
};

export default {
  state: INITIAL_STATE,
  reducers: {
    SET_PROP: (state, payload) => ({ ...state, ...payload }),
    SET_NAME: (state, payload) => ({ ...state, name: payload }),
    RESET: () => INITIAL_STATE,
  },
  effects: (dispatch) => ({
    async register(payload) {
      const { error, msg } = await http.post(API_ROUTES.AUTH.REGISTER, payload);
      dispatch.notifier.ADD_NOTIFICATION({ msg, variant: error ? 'error' : 'success' });
      if (!error) {
        await dispatch.user.login(payload);
      }
    },
    async login(payload) {
      try {
        const { user, token } = await http.post(API_ROUTES.AUTH.LOGIN, payload);
        dispatch.notifier.ADD_NOTIFICATION({ msg: 'Logged in successfully', variant: 'success' });
        tokenStorage.saveToken(tokenStorage.JWT_TOKEN, token);
        dispatch.user.SET_PROP(mapLoggedUser(user));
      } catch (err) {
        const msg = err.response?.data?.msg || err.message;
        dispatch.notifier.ADD_NOTIFICATION({ msg, variant: 'error' });
      }
    },
    async logout() {
      tokenStorage.removeToken(tokenStorage.JWT_TOKEN);
      dispatch.user.RESET();
    },
    async whoAmI() {
      try {
        const { user } = await http.get(API_ROUTES.AUTH.WHO_AM_I);
        dispatch.user.SET_PROP(mapLoggedUser(user));
      } catch (err) { /* */ }
    },
  }),
};

import { API_ROUTES } from 'src/enums';
import { HttpInstance } from 'src/utils';

const http = new HttpInstance();

export const getCurrentUser = ({ signal } = {}) => http.get(
  API_ROUTES.AUTH.WHO_AM_I,
  { signal },
);
export const login = (payload) => http.post(API_ROUTES.AUTH.LOGIN, payload);
export const register = (payload) => http.post(API_ROUTES.AUTH.REGISTER, payload);

import { API_ROUTES } from 'src/enums';
import { HttpInstance } from 'src/utils';

const http = new HttpInstance();

export const createRoom = (name) => http.post(API_ROUTES.ROOM.CREATE_ROOM, { name });
export const validateRoom = ({ id, signal }) => http.get(
  `${API_ROUTES.ROOM.BASE}/${id}/isValid`,
  { signal },
);

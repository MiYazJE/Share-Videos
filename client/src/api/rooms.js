import { API_ROUTES } from 'src/enums';
import { HttpInstance } from 'src/utils';

const http = new HttpInstance();

export const createRoom = () => http.post(API_ROUTES.ROOM.CREATE_ROOM);
export const validateRoom = ({ id, signal }) => http.get(
  `${API_ROUTES.ROOM.BASE}/${id}/isValid`,
  { signal },
);

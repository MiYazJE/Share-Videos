import api from '../Http/api';
import { SET_ROOM } from './actionTypes';

const setRoom = (room) => ({
    type: SET_ROOM,
    room
});

export const createRoom = (nameCreator, cb) => ({
    type: 'WS_CREATE_ROOM',
    promise: (socket) => socket.emit('createRoom', { nameCreator }),
    cb
});

import api from '../Http/api';
import { SET_ROOM } from './actionTypes';

const setRoom = (room) => ({
    type: SET_ROOM,
    room
});

export const createRoom = (nameCreator, cb) => ({
    type: 'socket',
    promise: (socket) => socket.emit('createRoom', { nameCreator }),
    cb
});

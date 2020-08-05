import io from 'socket.io-client';
import { WS_UPDATE_ROOM } from '../actions/actionTypes';
import { setRoom } from '../actions/roomActions';

const isDev = process.env.NODE_ENV === 'development';

const socket = isDev 
        ? io.connect('http://localhost:5000', { path: '/socket-io' }) 
        : io.connect({ path: '/socket-io' });

const socketMiddleware = () => (store) => {
    socket.on(WS_UPDATE_ROOM, (room) => {
        store.dispatch(setRoom(room));
    });
    
    return (next) => (action) => {
        if (action.type.includes('WS')) {
            console.log(action)
            socket.emit(action.type, action.payload);
        }
        else {
            return next(action);
        }
    }
};

export default socketMiddleware;

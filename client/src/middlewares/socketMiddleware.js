import io from 'socket.io-client';
import { setRoom } from '../actions/roomActions';

const isDev = process.env.NODE_ENV === 'development';

const socket = isDev ? io.connect('http://localhost:5000', { path: '/socket-io' }) : io.connect({ path: '/socket-io' });

const socketMiddleware = () => (store) => (next) => (action) => {
    socket.on('getRoom', (room) => {
        store.dispatch(setRoom(room));
    });
    
    switch (action.type) {
        case 'WS_JOIN_ROOM': {
            socket.emit('joinRoom', action.payload);
            break;
        }
        default:
            return next(action);
    }
};

export default socketMiddleware;

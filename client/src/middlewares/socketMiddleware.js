import io from 'socket.io-client';
import { WS_UPDATE_ROOM, WS_VIEW_VIDEO } from '../actions/actionTypes';
import { setRoom, setPlayVideo } from '../actions/roomActions';

const isDev = process.env.NODE_ENV === 'development';

const socket = isDev 
        ? io.connect('http://localhost:5000', { path: '/socket-io' }) 
        : io.connect({ path: '/socket-io' });

const socketMiddleware = () => (store) => {
    socket.on(WS_UPDATE_ROOM, (room) => {
        store.dispatch(setRoom(room));
    });

    socket.on(WS_VIEW_VIDEO, (payload) => {
        store.dispatch(setPlayVideo(payload));
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

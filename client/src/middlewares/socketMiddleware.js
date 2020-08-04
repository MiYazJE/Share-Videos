import io from 'socket.io-client';

const isDev = process.env.NODE_ENV == 'development';

const socket = isDev 
    ? io.connect('http://localhost:5000', { path: '/socket-io' })
    : io.connect({ path: '/socket-io' });

const socketMiddleware = store => next => action => {
    if (action.type === 'socket') {
        action.promise(socket);
        if (action.cb) action.cb(); 
    }
    else {
        next(action);
    }
}

export default socketMiddleware;
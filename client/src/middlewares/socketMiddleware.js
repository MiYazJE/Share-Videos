import io from 'socket.io-client';

const isDev = process.env.NODE_ENV == 'development';
console.log('dev', isDev)

const socket = isDev 
    ? io.connect('http://localhost:5000', { path: '/socket-io' })
    : io.connect({ path: '/socket-io' });

const socketMiddleware = store => next => action => {
    console.log('action', action);

    next(action);
}

export default socketMiddleware;
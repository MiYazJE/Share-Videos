import io from 'socket.io-client';

const isDev = process.env.NODE_ENV == 'development';

const socket = isDev 
    ? io.connect('http://localhost:5000', { path: '/socket-io' })
    : io.connect({ path: '/socket-io' });

const socketMiddleware = () => {

    return store => next => async action => {

        console.log(action);

        switch(action.type) {
            case 'WS_CREATE_ROOM': {
                await action.promise(socket);
                if (action.cb) action.cb(); 
            }
            default: return next(action);
        }
    }
};

export default socketMiddleware;
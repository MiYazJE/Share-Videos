import io from 'socket.io-client';
import { WS_MESSAGES } from 'src/enums';

const {
  WS_UPDATE_ROOM,
  WS_VIEW_VIDEO,
  WS_NOTIFY_MESSAGE,
  WS_UPDATE_CHAT,
} = WS_MESSAGES;

const isDev = process.env.NODE_ENV === 'development';

const socket = isDev ? io.connect('http://localhost:5000', { path: '/socket-io' }) : io.connect({ path: '/socket-io' });

const socketMiddleware = () => (store) => {
  socket.on(WS_UPDATE_ROOM, (room) => {
    store.dispatch.room.SET_PROP(room);
  });

  socket.on(WS_UPDATE_CHAT, (chat) => {
    store.dispatch.room.SET_PROP({ chat });
  });

  socket.on(WS_VIEW_VIDEO, (payload) => {
    store.dispatch.room.SET_PROP({ ...payload, isPlaying: true });
  });

  socket.on(WS_NOTIFY_MESSAGE, (notification) => {
    store.dispatch.notifier.ADD_NOTIFICATION(notification);
  });

  return (next) => (action) => {
    if (action.type.startsWith('WS')) {
      socket.emit(action.type, action.payload);
    } else {
      return next(action);
    }
  };
};

export default socketMiddleware;

import io from 'socket.io-client';
import {
  WS_UPDATE_ROOM, WS_VIEW_VIDEO, WS_NOTIFY_MESSAGE, WS_UPDATE_CHAT,
} from '../actions/actionTypes';
import { setRoom, setPlayVideo, setChat } from '../actions/roomActions';
import addNotification from '../actions/notifierAction';

const isDev = process.env.NODE_ENV === 'development';

const socket = isDev ? io.connect('http://localhost:5000', { path: '/socket-io' }) : io.connect({ path: '/socket-io' });

const socketMiddleware = () => (store) => {
  socket.on(WS_UPDATE_ROOM, (room) => {
    store.dispatch(setRoom(room));
  });

  socket.on(WS_UPDATE_CHAT, (chat) => {
    store.dispatch(setChat(chat));
  });

  socket.on(WS_VIEW_VIDEO, (payload) => {
    store.dispatch(setPlayVideo(payload));
  });

  socket.on(WS_NOTIFY_MESSAGE, (notification) => {
    store.dispatch(addNotification(notification));
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

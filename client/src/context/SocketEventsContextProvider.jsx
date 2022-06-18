import {
  useEffect,
  createContext,
  useState,
  useMemo,
  useContext,
} from 'react';
import { useDispatch } from 'react-redux';
import io from 'socket.io-client';

import { WS_MESSAGES, VIDEOS } from 'src/enums';

const {
  WS_VIEW_VIDEO,
  WS_JOIN_ROOM,
  WS_ADD_VIDEO,
  WS_REMOVE_VIDEO,
  WS_SEND_PLAYER_STATE,
  WS_SEND_PROGRESS,
  WS_SEND_MESSAGE,
  WS_UPDATE_ROOM,
  WS_UPDATE_CHAT,
  WS_NOTIFY_MESSAGE,
} = WS_MESSAGES;

const isDev = process.env.NODE_ENV === 'development';

const SocketEventsContext = createContext({});

function SocketEventsProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const socketConnection = isDev
      ? io.connect('http://localhost:5000', { path: '/socket-io' })
      : io.connect({ path: '/socket-io' });
    setSocket(socketConnection);
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on(WS_UPDATE_ROOM, (room) => dispatch.room.SET_PROP({ ...room }));
    socket.on(WS_UPDATE_CHAT, (chat) => dispatch.room.SET_PROP({ chat }));
    socket.on(
      WS_NOTIFY_MESSAGE,
      (notification) => dispatch.notifier.ADD_NOTIFICATION(notification),
    );
  }, [socket, dispatch]);

  const value = useMemo(() => ({
    joinRoom: (payload) => socket.emit(WS_JOIN_ROOM, payload),
    enqueueVideo: (payload) => socket.emit(WS_ADD_VIDEO, payload),
    removeVideo: (payload) => socket.emit(WS_REMOVE_VIDEO, payload),
    viewVideo: (payload) => socket.emit(WS_VIEW_VIDEO, payload),
    sendPlayerState: (payload) => socket.emit(WS_SEND_PLAYER_STATE, payload),
    sendProgress: (payload) => socket.emit(WS_SEND_PROGRESS, payload),
    sendMessage: (payload) => socket.emit(WS_SEND_MESSAGE, payload),
    pauseVideo:
    (idRoom) => socket.emit(WS_SEND_PLAYER_STATE, { idRoom, state: VIDEOS.STATE.PAUSE }),
  }), [socket]);

  return (
    <SocketEventsContext.Provider value={value}>
      {children}
    </SocketEventsContext.Provider>
  );
}

export const useSocketEvents = () => useContext(SocketEventsContext);

export default SocketEventsProvider;

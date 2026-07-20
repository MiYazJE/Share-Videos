import {
  useEffect,
  createContext,
  useMemo,
  useContext,
  useReducer,
  useState,
} from 'react';
import io from 'socket.io-client';

import { WS_MESSAGES } from 'src/enums';
import { useNotification } from './NotificationContextProvider';
import { INITIAL_ROOM_STATE, roomReducer } from './roomReducer';
import { createSocketActions } from './socketActions';

const {
  WS_UPDATE_ROOM,
  WS_UPDATE_CHAT,
  WS_NOTIFY_MESSAGE,
} = WS_MESSAGES;

const apiUrl = import.meta.env.VITE_API_URL;

const SocketEventsContext = createContext({});
const RoomStateContext = createContext(null);

function SocketEventsProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [room, dispatch] = useReducer(roomReducer, INITIAL_ROOM_STATE);
  const { notify } = useNotification();

  useEffect(() => {
    const socketConnection = io.connect(apiUrl || 'http://localhost:5000', { path: '/socket-io' });
    setSocket(socketConnection);
  }, []);

  useEffect(() => {
    if (!socket) return;

    const updateRoom = (payload) => dispatch({ type: 'room/updated', payload });
    const updateChat = (payload) => dispatch({ type: 'chat/updated', payload });
    socket.on(WS_UPDATE_ROOM, updateRoom);
    socket.on(WS_UPDATE_CHAT, updateChat);
    socket.on(WS_NOTIFY_MESSAGE, notify);

    return () => {
      socket.off(WS_UPDATE_ROOM, updateRoom);
      socket.off(WS_UPDATE_CHAT, updateChat);
      socket.off(WS_NOTIFY_MESSAGE, notify);
    };
  }, [socket, notify]);

  const value = useMemo(() => createSocketActions(socket, dispatch), [socket]);

  return (
    <SocketEventsContext.Provider value={value}>
      <RoomStateContext.Provider value={room}>
        {children}
      </RoomStateContext.Provider>
    </SocketEventsContext.Provider>
  );
}

export const useSocketEvents = () => useContext(SocketEventsContext);
export const useRoomState = () => {
  const value = useContext(RoomStateContext);
  if (!value) throw new Error('useRoomState must be used inside SocketEventsProvider');
  return value;
};

export default SocketEventsProvider;

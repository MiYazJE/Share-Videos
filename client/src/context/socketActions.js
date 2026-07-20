import { VIDEOS, WS_MESSAGES } from 'src/enums';

const {
  WS_VIEW_VIDEO,
  WS_JOIN_ROOM,
  WS_ADD_VIDEO,
  WS_REMOVE_VIDEO,
  WS_SEND_PLAYER_STATE,
  WS_SEND_PROGRESS,
  WS_SEND_MESSAGE,
  WS_REORDER_PLAYLIST,
  WS_LEAVE_ROOM,
} = WS_MESSAGES;

export const createSocketActions = (socket, dispatch) => ({
  joinRoom: (payload) => socket?.emit(WS_JOIN_ROOM, payload),
  enqueueVideo: (payload) => socket?.emit(WS_ADD_VIDEO, payload),
  removeVideo: (payload) => socket?.emit(WS_REMOVE_VIDEO, payload),
  viewVideo: (payload) => socket?.emit(WS_VIEW_VIDEO, payload),
  sendPlayerState: (payload) => socket?.emit(WS_SEND_PLAYER_STATE, payload),
  sendProgress: (payload) => socket?.emit(WS_SEND_PROGRESS, payload),
  sendMessage: (payload) => socket?.emit(WS_SEND_MESSAGE, payload),
  reorderPlaylist: (payload) => socket?.emit(WS_REORDER_PLAYLIST, payload),
  leaveRoom: () => {
    socket?.emit(WS_LEAVE_ROOM);
    dispatch({ type: 'room/reset' });
  },
  markSeekHandled: () => dispatch({ type: 'seek/handled' }),
  pauseVideo: (roomId) => socket?.emit(WS_SEND_PLAYER_STATE, {
    roomId,
    state: VIDEOS.STATE.PAUSE,
  }),
});

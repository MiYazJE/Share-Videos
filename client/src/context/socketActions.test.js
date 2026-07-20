import {
  describe, expect, it, vi,
} from 'vitest';
import { WS_MESSAGES } from 'src/enums';
import { createSocketActions } from './socketActions';

describe('socket actions', () => {
  it('preserves the join event and payload', () => {
    const socket = { emit: vi.fn() };
    const actions = createSocketActions(socket, vi.fn());
    const payload = { roomId: 'room-1', name: 'Guest', isLogged: false };
    actions.joinRoom(payload);
    expect(socket.emit).toHaveBeenCalledWith(WS_MESSAGES.WS_JOIN_ROOM, payload);
  });

  it('preserves authenticated join identity', () => {
    const socket = { emit: vi.fn() };
    const payload = { roomId: 'room-1', name: 'Miya', isLogged: true };
    createSocketActions(socket, vi.fn()).joinRoom(payload);
    expect(socket.emit).toHaveBeenCalledWith(WS_MESSAGES.WS_JOIN_ROOM, payload);
  });

  it('emits leave and clears route-scoped state', () => {
    const socket = { emit: vi.fn() };
    const dispatch = vi.fn();
    createSocketActions(socket, dispatch).leaveRoom();
    expect(socket.emit).toHaveBeenCalledWith(WS_MESSAGES.WS_LEAVE_ROOM);
    expect(dispatch).toHaveBeenCalledWith({ type: 'room/reset' });
  });

  it('can safely receive actions before the socket connects', () => {
    expect(() => createSocketActions(null, vi.fn()).joinRoom({})).not.toThrow();
  });
});

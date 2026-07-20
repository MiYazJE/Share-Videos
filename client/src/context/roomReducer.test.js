import { describe, expect, it } from 'vitest';
import { INITIAL_ROOM_STATE, roomReducer } from './roomReducer';

describe('roomReducer', () => {
  it('applies room snapshots', () => {
    expect(roomReducer(INITIAL_ROOM_STATE, {
      type: 'room/updated', payload: { id: 'room-1', users: [{ id: 'u1' }] },
    })).toMatchObject({ id: 'room-1', users: [{ id: 'u1' }] });
  });

  it('updates chat independently', () => {
    const state = { ...INITIAL_ROOM_STATE, id: 'room-1' };
    expect(roomReducer(state, { type: 'chat/updated', payload: [{ msg: 'hello' }] }))
      .toMatchObject({ id: 'room-1', chat: [{ msg: 'hello' }] });
  });

  it('applies playback progress and seek snapshots', () => {
    expect(roomReducer(INITIAL_ROOM_STATE, {
      type: 'room/updated', payload: { isPlaying: true, progressVideo: 42, seekVideo: true },
    })).toMatchObject({ isPlaying: true, progressVideo: 42, seekVideo: true });
  });

  it('resets route-scoped state', () => {
    const state = { ...INITIAL_ROOM_STATE, id: 'room-1', isPlaying: true };
    expect(roomReducer(state, { type: 'room/reset' })).toEqual(INITIAL_ROOM_STATE);
  });
});

import {
  describe, expect, it, vi,
} from 'vitest';
import {
  ANONYMOUS_USER,
  clearSession,
  isExpectedAnonymous,
  mapAuthenticatedUser,
} from './sessionState';

describe('session state', () => {
  it('maps authenticated users without guest state', () => {
    expect(mapAuthenticatedUser({ id: 'u1', name: 'Miya' })).toMatchObject({
      id: 'u1', name: 'Miya', isLogged: true,
    });
  });

  it('treats missing credentials and 401 as anonymous', () => {
    expect(isExpectedAnonymous({ error: { status: 500 }, token: null })).toBe(true);
    expect(isExpectedAnonymous({ error: { status: 401 }, token: 'Bearer token' })).toBe(true);
  });

  it('keeps service failures observable when credentials exist', () => {
    expect(isExpectedAnonymous({ error: { status: 503 }, token: 'Bearer token' })).toBe(false);
    expect(ANONYMOUS_USER.isLogged).toBe(false);
  });

  it('clears tokens and identity-sensitive cache entries on logout', () => {
    const queryClient = { setQueryData: vi.fn(), removeQueries: vi.fn() };
    const tokenStorage = { JWT_TOKEN: 'jwt', removeToken: vi.fn() };
    clearSession({ queryClient, tokenStorage, sessionKey: ['session'] });
    expect(tokenStorage.removeToken).toHaveBeenCalledWith('jwt');
    expect(queryClient.setQueryData).toHaveBeenCalledWith(['session'], ANONYMOUS_USER);
    const [{ predicate }] = queryClient.removeQueries.mock.calls[0];
    expect(predicate({ queryKey: ['private', 'playlists'] })).toBe(true);
    expect(predicate({ queryKey: ['videos'] })).toBe(false);
  });
});

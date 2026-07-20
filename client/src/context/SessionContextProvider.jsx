import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { getCurrentUser } from 'src/api/auth';
import { queryKeys } from 'src/queries/keys';
import tokenStorage from 'src/utils/token-storage';
import {
  ANONYMOUS_USER,
  clearSession,
  isExpectedAnonymous,
  mapAuthenticatedUser,
} from './sessionState';
const SessionContext = createContext(null);

function SessionProvider({ children }) {
  const queryClient = useQueryClient();
  const [guestName, setGuestName] = useState('');
  const sessionQuery = useQuery({
    queryKey: queryKeys.session,
    queryFn: async ({ signal }) => {
      try {
        const { user } = await getCurrentUser({ signal });
        return mapAuthenticatedUser(user);
      } catch (error) {
        if (isExpectedAnonymous({
          error,
          token: tokenStorage.extractToken(tokenStorage.JWT_TOKEN),
        })) {
          return ANONYMOUS_USER;
        }
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000,
  });

  const setAuthenticatedUser = useCallback((user) => {
    queryClient.setQueryData(queryKeys.session, mapAuthenticatedUser(user));
  }, [queryClient]);

  const logout = useCallback(() => {
    clearSession({ queryClient, tokenStorage, sessionKey: queryKeys.session });
  }, [queryClient]);

  const user = sessionQuery.data || ANONYMOUS_USER;
  const name = user.isLogged ? user.name : guestName;
  const value = useMemo(() => ({
    user,
    name,
    color: user.color,
    guestName,
    setGuestName,
    setAuthenticatedUser,
    logout,
    sessionQuery,
  }), [user, name, guestName, setAuthenticatedUser, logout, sessionQuery]);

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export const useSession = () => {
  const value = useContext(SessionContext);
  if (!value) throw new Error('useSession must be used inside SessionProvider');
  return value;
};

export default SessionProvider;

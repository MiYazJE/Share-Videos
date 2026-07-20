export const DEFAULT_COLOR = 'rgb(169 30 7 / 80%)';
export const ANONYMOUS_USER = {
  name: '',
  avatarBase64: '',
  id: null,
  color: DEFAULT_COLOR,
  isLogged: false,
};

export const mapAuthenticatedUser = (user) => ({
  ...ANONYMOUS_USER,
  ...user,
  isLogged: true,
});

export const isExpectedAnonymous = ({ error, token }) => (
  !token || error.status === 401
);

export const clearSession = ({ queryClient, tokenStorage, sessionKey }) => {
  tokenStorage.removeToken(tokenStorage.JWT_TOKEN);
  queryClient.setQueryData(sessionKey, ANONYMOUS_USER);
  queryClient.removeQueries({ predicate: ({ queryKey }) => queryKey[0] === 'private' });
};

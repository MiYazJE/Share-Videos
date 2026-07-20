import { useCallback, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';

import BoxDialog from 'src/components/Home/BoxDialog/BoxDialog';
import AuthenticationRequiredDialog from 'src/components/Home/AuthenticationRequiredDialog';
import NavBar from 'src/components/NavBar/NavBar';
import Register from 'src/components/Register';
import Login from 'src/components/Login';
import * as authApi from 'src/api/auth';
import { createRoom } from 'src/api/rooms';
import { useSession } from 'src/context/SessionContextProvider';
import { useNotification } from 'src/context/NotificationContextProvider';
import tokenStorage from 'src/utils/token-storage';

function Home() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showAuthenticationRequired, setShowAuthenticationRequired] = useState(false);
  const pendingCreateRef = useRef(false);

  const history = useHistory();
  const { setAuthenticatedUser, sessionQuery, user: sessionUser } = useSession();
  const { notify } = useNotification();

  const createRoomMutation = useMutation({
    mutationFn: createRoom,
    onSuccess: (room) => history.push(`/room/${room.id}`),
    onError: (error) => notify({ msg: error.message, variant: 'error' }),
  });
  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: ({ user, token }) => {
      tokenStorage.saveToken(tokenStorage.JWT_TOKEN, token);
      setAuthenticatedUser(user);
      notify({ msg: 'Logged in successfully', variant: 'success' });

      if (pendingCreateRef.current) {
        pendingCreateRef.current = false;
        createRoomMutation.mutate();
      }
    },
    onError: (error) => notify({ msg: error.message, variant: 'error' }),
  });
  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: async (_, payload) => loginMutation.mutateAsync(payload),
    onError: (error) => notify({ msg: error.message, variant: 'error' }),
  });

  const cancelPendingCreate = useCallback(() => {
    pendingCreateRef.current = false;
  }, []);

  const closeLoginModal = useCallback(() => {
    cancelPendingCreate();
    setShowLoginModal(false);
  }, [cancelPendingCreate]);
  const closeRegisterModal = useCallback(() => {
    cancelPendingCreate();
    setShowRegisterModal(false);
  }, [cancelPendingCreate]);

  const openLogin = useCallback(() => {
    cancelPendingCreate();
    setShowLoginModal(true);
  }, [cancelPendingCreate]);
  const openRegister = useCallback(() => {
    cancelPendingCreate();
    setShowRegisterModal(true);
  }, [cancelPendingCreate]);

  const handleCreateRoom = () => {
    if (sessionQuery.isPending) return;
    if (sessionUser.isLogged) {
      createRoomMutation.mutate();
      return;
    }

    pendingCreateRef.current = true;
    setShowAuthenticationRequired(true);
  };

  const closeAuthenticationRequired = () => {
    cancelPendingCreate();
    setShowAuthenticationRequired(false);
  };

  const authenticateForPendingCreate = (method) => {
    setShowAuthenticationRequired(false);
    if (method === 'login') setShowLoginModal(true);
    if (method === 'register') setShowRegisterModal(true);
  };

  const handleRegister = (payload) => {
    const { name, password } = payload;
    registerMutation.mutate({
      name,
      password,
    });
  };

  return (
    <div id="home">
      <NavBar
        openLogin={openLogin}
        openRegister={openRegister}
      />
      <BoxDialog
        onCreateRoom={handleCreateRoom}
        isLoading={createRoomMutation.isPending}
        isCreateDisabled={sessionQuery.isPending}
      />

      <AuthenticationRequiredDialog
        open={showAuthenticationRequired}
        onClose={closeAuthenticationRequired}
        onLogin={() => authenticateForPendingCreate('login')}
        onRegister={() => authenticateForPendingCreate('register')}
      />

      <Register
        open={showRegisterModal}
        onClose={closeRegisterModal}
        onRegister={handleRegister}
        loading={registerMutation.isPending || loginMutation.isPending}
      />
      <Login
        open={showLoginModal}
        onClose={closeLoginModal}
        onLogin={loginMutation.mutate}
        loading={loginMutation.isPending}
      />
    </div>
  );
}

export default Home;

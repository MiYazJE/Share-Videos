import { useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';

import BoxDialog from 'src/components/Home/BoxDialog/BoxDialog';
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

  const history = useHistory();
  const { setAuthenticatedUser, setGuestName } = useSession();
  const { notify } = useNotification();

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: ({ user, token }) => {
      tokenStorage.saveToken(tokenStorage.JWT_TOKEN, token);
      setAuthenticatedUser(user);
      notify({ msg: 'Logged in successfully', variant: 'success' });
    },
    onError: (error) => notify({ msg: error.message, variant: 'error' }),
  });
  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: async (_, payload) => loginMutation.mutateAsync(payload),
    onError: (error) => notify({ msg: error.message, variant: 'error' }),
  });
  const createRoomMutation = useMutation({
    mutationFn: createRoom,
    onSuccess: (room, nickname) => {
      setGuestName(nickname);
      history.push(`/room/${room.id}`);
    },
    onError: (error) => notify({ msg: error.message, variant: 'error' }),
  });

  const closeLoginModal = useCallback(() => setShowLoginModal(false), []);
  const closeRegisterModal = useCallback(() => setShowRegisterModal(false), []);

  const handleCreateRoom = ({ nickName }) => {
    createRoomMutation.mutate(nickName);
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
        openLogin={() => setShowLoginModal(true)}
        openRegister={() => setShowRegisterModal(true)}
      />
      <BoxDialog onCreateRoom={handleCreateRoom} isLoading={createRoomMutation.isPending} />

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

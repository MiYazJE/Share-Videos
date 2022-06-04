import { useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import BoxDialog from 'src/components/Home/BoxDialog/BoxDialog';
import NavBar from 'src/components/NavBar/NavBar';
import Register from 'src/components/Register';
import Login from 'src/components/Login';

import './home.scss';

const readSelectors = ({ loading }) => ({
  loginIsLoading: loading.effects.user.login,
  registerIsLoading: loading.effects.user.register,
  creatingRoom: loading.effects.room.createRoom,
});

function Home() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const {
    loginIsLoading,
    registerIsLoading,
    creatingRoom,
  } = useSelector(readSelectors);

  const dispatch = useDispatch();
  const history = useHistory();

  const closeLoginModal = useCallback(() => setShowLoginModal(false), []);
  const closeRegisterModal = useCallback(() => setShowRegisterModal(false), []);

  const handleCreateRoom = async ({ nickName }) => {
    const idRoom = await dispatch.room.createRoom(nickName);
    history.push(`/room/${idRoom}`);
  };

  const handleRegister = (payload) => {
    const { name, password } = payload;
    dispatch.user.register({
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
      <BoxDialog onCreateRoom={handleCreateRoom} isLoading={creatingRoom} />

      <Register
        open={showRegisterModal}
        onClose={closeRegisterModal}
        onRegister={handleRegister}
        loading={registerIsLoading}
      />
      <Login
        open={showLoginModal}
        onClose={closeLoginModal}
        onLogin={dispatch.user.login}
        loading={loginIsLoading}
      />
    </div>
  );
}

export default Home;

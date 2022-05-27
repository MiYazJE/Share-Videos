import { useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import BoxDialog from 'src/components/Home/BoxDialog/BoxDialog';
import NavBar from 'src/components/NavBar/NavBar';
import Login from 'src/components/Login';
import './home.scss';

const readSelectors = ({ loading }) => ({
  isLoading: loading.effects.user.login,
  creatingRoom: loading.effects.room.createRoom,
});

function Home() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const { isLoading, creatingRoom } = useSelector(readSelectors);
  const dispatch = useDispatch();
  const history = useHistory();

  const closeLoginModal = useCallback(() => setShowLoginModal(false), []);

  const handleCreateRoom = async ({ nickName }) => {
    const idRoom = await dispatch.room.createRoom(nickName);
    history.push(`/room/${idRoom}`);
  };

  return (
    <div id="home">
      <NavBar
        openLogin={() => setShowLoginModal(true)}
        openRegister={() => setShowRegisterModal(true)}
      />
      <BoxDialog onCreateRoom={handleCreateRoom} isLoading={creatingRoom} />
      {/* <Modal
        open={modalStatus !== MODAL_STATUS.CLOSED}
        onClose={closeModal}
      >
        {modalStatus === MODAL_STATUS.REGISTER ? <Register /> : null}
      </Modal> */}

      <Login
        open={showLoginModal}
        onClose={closeLoginModal}
        onLogin={dispatch.user.login}
        loading={isLoading}
      />
    </div>
  );
}

export default Home;

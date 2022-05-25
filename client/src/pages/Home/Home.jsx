import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import BoxDialog from 'src/components/Home/BoxDialog/BoxDialog';
import NavBar from 'src/components/NavBar/NavBar';
import Login from 'src/components/Login';
import './home.scss';

const readSelectors = ({ loading }) => ({
  isLoading: loading.effects.user.login,
});

function Home() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const { isLoading } = useSelector(readSelectors);
  const dispatch = useDispatch();

  const closeLoginModal = useCallback(() => setShowLoginModal(false), []);

  return (
    <div id="home">
      <NavBar
        openLogin={() => setShowLoginModal(true)}
        openRegister={() => setShowRegisterModal(true)}
      />
      <BoxDialog />
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

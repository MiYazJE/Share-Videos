import React from 'react';
import { connect } from 'react-redux';
import BoxDialog from './BoxDialog/BoxDialog';
import NavBar from '../NavBar/NavBar';
import Modal from '../Modal';
import Register from '../Register';
import Login from '../Login';
import { MODAL_STATUS, readStatus } from '../../reducers/modalReducer';
import { closeModal } from '../../actions/modalActions';
import './home.scss';

function Home({ modalStatus, closeModal }) {
  return (
    <div id="home">
      <NavBar />
      <BoxDialog />
      <Modal
        open={modalStatus !== MODAL_STATUS.CLOSED}
        onClose={closeModal}
      >
        {modalStatus === MODAL_STATUS.REGISTER ? <Register /> : null}
        {modalStatus === MODAL_STATUS.LOGIN ? <Login /> : null}
      </Modal>
    </div>
  );
}

const mapStateToProps = (state) => ({
  modalStatus: readStatus(state),
});

const mapDispatchToProps = (dispatch) => ({
  closeModal: () => dispatch(closeModal()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);

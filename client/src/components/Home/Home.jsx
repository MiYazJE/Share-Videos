import React from 'react';
import BoxDialog from './BoxDialog/BoxDialog';
import NavBar from '../NavBar/NavBar';
import Modal from '../Modal';
import Register from '../Register';
import Login from '../Login';
import { connect } from 'react-redux';
import { readStatus } from '../../reducers/modalReducer';
import { closeModal } from '../../actions/modalActions';
import './home.scss';

const Home = ({ modalStatus, closeModal }) => {
    return (
        <div id="home">
            <NavBar />
            <BoxDialog />
            <Modal
                open={modalStatus !== 'CLOSED'}
                onClose={closeModal}
            >
                {modalStatus === 'REGISTER'
                    ? <Register />
                    : modalStatus === 'LOGIN' ? <Login /> : null}
            </Modal>
        </div>
    );
};

const mapStateToProps = (state) => ({
    modalStatus: readStatus(state),
});

const mapDispatchToProps = (dispatch) => ({
    closeModal: () => dispatch(closeModal()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);

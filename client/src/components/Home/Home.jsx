import React, { useState } from 'react';
import { Button, TextField, FormControl, FormHelperText } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import DialogJoinRoom from './DialogJoinRoom';
import Register from '../Register';
import Login from '../Login';
import Modal from '../Modal';
import AuthenticationNav from '../AuthenticationNav/AuthenticationNav';
import { connect } from 'react-redux';
import { setName } from '../../actions/userActions';
import { createRoom } from '../../actions/roomActions';
import { readName, readIsLogged } from '../../reducers/userReducer';
import './home.scss';

const MODAL_TYPE = {
    LOGIN: 'LOGIN',
    REGISTER: 'REGISTER',
    CLOSED: 'CLOSED',
}

const Home = ({ createRoom, name, setName, isLogged }) => {
    const [errorNoNickname, setErrorNoNickname] = useState(false);
    const [openDialogJoinRoom, setOpenDialogJoinRoom] = useState(false);
    const [modalStatus, setModalStatus] = useState(MODAL_TYPE.CLOSED);
    const history = useHistory();

    const handleCreateRoom = () => {
        if (name) createRoom(name, (id) => history.push(`/room/${id}`));
        else setErrorNoNickname(true);
    }

    const handleOnClose = () => setModalStatus(MODAL_TYPE.CLOSED);

    return (
        <div id="home">
            <AuthenticationNav
                openRegister={() => setModalStatus(MODAL_TYPE.REGISTER)}
                openLogin={() => setModalStatus(MODAL_TYPE.LOGIN)}
            />
            <h1>Share Videos</h1>
            <div className="wrap">
                <FormControl error={errorNoNickname}>
                    <TextField
                        value={name}
                        onChange={({ target }) => setName(target.value)}
                        label="Name"
                        variant="outlined"
                    />
                    {errorNoNickname
                        ? (
                            <FormHelperText id="component-error-text">Your nickname is empty!</FormHelperText>
                        ) : null}
                </FormControl>
                <div className="buttons">
                    <Button onClick={handleCreateRoom} variant="contained" color="primary">
                        Create room
                    </Button>
                    <Button onClick={() => setOpenDialogJoinRoom(true)} variant="contained" color="secondary">
                        Join Room
                    </Button>
                </div>
            </div>
            <DialogJoinRoom
                open={openDialogJoinRoom}
                onCancel={() => setOpenDialogJoinRoom(false)}
            />
            <Modal
                open={modalStatus !== MODAL_TYPE.CLOSED}
                onClose={handleOnClose}
            >
                {modalStatus === MODAL_TYPE.REGISTER
                    ? <Register onClose={handleOnClose} />
                    : modalStatus === MODAL_TYPE.LOGIN ? <Login onClose={handleOnClose} /> : null}
            </Modal>
        </div>
    );
};

const mapStateToProps = (state) => ({
    name: readName(state),
    isLogged: readIsLogged(state),
});

const mapDispatchToProps = (dispatch) => ({
    createRoom: (name, cb) => dispatch(createRoom(name, cb)),
    setName: (name) => dispatch(setName(name)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);

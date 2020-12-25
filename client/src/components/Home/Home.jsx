import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { setName } from '../../actions/userActions';
import { createRoom } from '../../actions/roomActions';
import { readName, readIsLogged } from '../../reducers/userReducer';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import DialogJoinRoom from './DialogJoinRoom';
import Register from '../Register';
import Login from '../Login';
import Modal from '../Modal';
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
            <div id="wrapLogin">
                {isLogged
                    ? <h3>Welcome <span style={{ color: 'green' }}>{name}</span></h3>
                    :
                    (<>
                        <Button
                            variant="outlined"
                            size="medium"
                            onClick={() => setModalStatus(MODAL_TYPE.LOGIN)}
                        >
                            LOGIN
                            </Button>
                        <Button
                            variant="outlined"
                            color="secondary"
                            size="medium"
                            onClick={() => setModalStatus(MODAL_TYPE.REGISTER)}
                        >
                            REGISTER
                            </Button>
                    </>)
                }
            </div>
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
                <DialogJoinRoom
                    open={openDialogJoinRoom}
                    onCancel={() => setOpenDialogJoinRoom(false)}
                />
            </div>
            <Modal
                open={modalStatus !== MODAL_TYPE.CLOSED}
                onClose={handleOnClose}
            >
                {modalStatus === MODAL_TYPE.REGISTER
                    ? <Register onClose={handleOnClose} />
                    : <Login onClose={handleOnClose} />}
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

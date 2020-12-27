import { Button, FormControl, FormHelperText, TextField, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { createRoom } from '../../../actions/roomActions';
import { setName } from '../../../actions/userActions';
import { readName } from '../../../reducers/userReducer';
import DialogJoinRoom from '../DialogJoinRoom/DialogJoinRoom';

function BoxDialog({ name, createRoom, setName }) {
    const history = useHistory();

    const [errorNoNickname, setErrorNoNickname] = useState(false);
    const [openDialogJoinRoom, setOpenDialogJoinRoom] = useState(false);

    const handleCreateRoom = () => {
        if (name) createRoom(name, (id) => history.push(`/room/${id}`));
        else setErrorNoNickname(true);
    }

    return (
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
    );
}

const mapStateToProps = (state) => ({
    name: readName(state),
});

const mapDispatchToProps = (dispatch) => ({
    createRoom: (name, callback) => dispatch(createRoom(name, callback)),
    setName: (name) => dispatch(setName(name)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BoxDialog);
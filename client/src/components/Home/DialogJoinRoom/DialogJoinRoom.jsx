import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { readName } from '../../../reducers/userReducer';
import { isValidRoom } from '../../../actions/roomActions';
import { readIsLoading } from '../../../reducers/roomReducer';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import { DialogActions, DialogContent, FormHelperText } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';

const stylesContentDialog = {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center'
}

const DialogJoinRoom = ({ open, name, onCancel, isLoading, isValidRoom }) => {
    const [idRoom, setIdRoom] = useState('');
    const [errorRoomId, setErrorRoomId] = useState('');

    const history = useHistory();

    const handleJoinRoom = () => {
        if (!idRoom) {
            setErrorRoomId('The room id is empty!');
            return;
        }

        console.log('joining room...');
        isValidRoom(
            idRoom, 
            () => setErrorRoomId('The roomID is not valid'),
            () => {
                history.push(`/room/${idRoom}`) 
                onCancel();
            }
        );
    }

    return (
        <Dialog
            disableBackdropClick
            disableEscapeKeyDown
            open={open}
            aria-labelledby="form-dialog-title"
            onKeyDown={({ key }) => key === 'Enter' && handleJoinRoom(name)}
        >
            <DialogContent style={stylesContentDialog}>
                <FormControl error={errorRoomId}>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="roomID"
                        label="Room id"
                        type="name"
                        onChange={({ target }) => setIdRoom(target.value)}
                    />
                    {errorRoomId
                        ? (
                            <FormHelperText id="roomID">{errorRoomId}</FormHelperText>
                        ) : null}
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button
                    size="small"
                    onClick={onCancel}
                    color="secondary"
                    variant="contained"
                >
                    CANCEL
                </Button>
                <Button
                    size="small"
                    onClick={() => handleJoinRoom()}
                    color="primary"
                    variant="contained"
                    disabled={isLoading}
                >
                    JOIN
                </Button>
            </DialogActions>
        </Dialog>
    );
};

const mapStateToProps = (state) => ({
    name: readName(state),
    isLoading: readIsLoading(state)
});

const mapDispatchToProps = (dispatch) => ({
    isValidRoom: (id, cbFailure, cbSuccess) => dispatch(isValidRoom(id, cbFailure, cbSuccess))
});

export default connect(mapStateToProps, mapDispatchToProps)(DialogJoinRoom);

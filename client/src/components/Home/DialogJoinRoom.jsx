import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { readName } from '../../reducers/userReducer';
import { isValidRoom } from '../../actions/roomActions';
import { readIsLoading } from '../../reducers/roomReducer';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';

const stylesContentDialog = {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center'
}

const DialogJoinRoom = ({ open, name, onCancel, isLoading, isValidRoom, joinRoom }) => {
    const [idRoom, setIdRoom] = useState('');
    const history = useHistory();

    const handleJoinRoom = () => {
        console.log('joining room...');
        isValidRoom(
            idRoom, 
            () => console.log('the room is not valid'),
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
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="room"
                    type="name"
                    onChange={({ target }) => setIdRoom(target.value)}
                />
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

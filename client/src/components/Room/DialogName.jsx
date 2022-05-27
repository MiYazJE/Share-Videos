import { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';

const stylesContentDialog = {
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  alignItems: 'center',
};

function DialogName({ open, onAccept, onCancel }) {
  const [nickname, setNickname] = useState(false);

  return (
    <Dialog
      disableBackdropClick
      disableEscapeKeyDown
      open={open}
      aria-labelledby="form-dialog-title"
      onKeyDown={({ key }) => key === 'Enter' && onAccept(nickname)}
    >
      <DialogContent style={stylesContentDialog}>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="nickname"
          type="name"
          onChange={({ target }) => setNickname(target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button size="small" onClick={onCancel} color="secondary" variant="contained">
          CANCEL
        </Button>
        <Button size="small" onClick={() => onAccept(nickname)} color="primary" variant="contained">
          ACCEPT
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DialogName;

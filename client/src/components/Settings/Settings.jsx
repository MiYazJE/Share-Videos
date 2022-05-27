import { Input } from '@material-ui/core';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

import './settings.scss';

const readRoomId = ({ room }) => room.id;

function Settings() {
  const roomId = useSelector(readRoomId);

  const clipBoardUrl = () => {
    navigator.clipboard.writeText(window.location);
    toast.dark('✅ Url is on your clipboard.', {
      position: 'bottom-right',
      hideProgressBar: true,
    });
  };

  const clipBoardId = () => {
    navigator.clipboard.writeText(roomId);
    toast.dark('✅ Id room is on your clipboard.', {
      position: 'bottom-right',
      hideProgressBar: true,
    });
  };

  return (
    <div className="wrapSettings">
      <h1>Room url</h1>
      <Input
        onClick={clipBoardUrl}
        onFocus={({ target }) => target.setSelectionRange(0, 100)}
        fullWidth="100%"
        value={window.location}
        defaultValue={window.location}
        inputProps={{ 'aria-label': 'description' }}
      />
      <h1>Room id</h1>
      <Input
        onClick={clipBoardId}
        onFocus={({ target }) => target.setSelectionRange(0, 100)}
        fullWidth="100%"
        value={roomId}
        defaultValue={roomId}
        inputProps={{ 'aria-label': 'description' }}
      />
    </div>
  );
}

export default Settings;

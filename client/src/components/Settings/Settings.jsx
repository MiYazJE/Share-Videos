import React from 'react';
import { connect } from 'react-redux';
import { Input } from '@material-ui/core';
import { toast } from 'react-toastify';
import { readRoomName } from '../../reducers/roomReducer';
import './settings.scss';

function Settings({ roomId }) {
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

const mapStateToProps = (state) => ({
  roomId: readRoomName(state),
});

export default connect(mapStateToProps, {})(Settings);

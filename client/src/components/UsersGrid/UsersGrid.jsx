import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import { sendMessage } from '../../actions/roomActions';
import { readUsers, readRoomName, readChat } from '../../reducers/roomReducer';
import { readName } from '../../reducers/userReducer';
import TextField from '@material-ui/core/TextField';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import SendIcon from '@material-ui/icons/Send';
import IconButton from '@material-ui/core/IconButton';
import './usersGrid.scss';

const Message = ({ isAdmin, emitter, msg, me, time }) => {
    const meClass = me === emitter ? 'me' : '';
    const adminClass = isAdmin ? 'isAdmin' : '';
    emitter = isAdmin ? 'Info' : meClass ? 'Me' : emitter
    return (
        <div className={`message ${meClass} ${adminClass}`}>
            <p>
                <span className={`emitter ${adminClass ? 'admin' : ''}`}>{emitter}</span>
                <span className="time">{time}</span>
            </p>
            <span className="body">{msg}</span>
        </div>
    );
};

const UsersGrid = ({ chat, me, users, sendMessage, idRoom }) => {
    const [msg, setMessage] = useState('');
    const [isWriting, setIsWriting] = useState(false);
    const refScroll = useRef(null);

    const scrollToBottom = () => {
        // if (!isWriting) return;
        refScroll.current && refScroll.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }

    useEffect(scrollToBottom, [chat]);

    const handleSubmit = (e) => {
        e && e.preventDefault();
        if (msg.trim()) {
            sendMessage({ name: me, msg, idRoom });
            setMessage('');
        }
    }

    return (
        <div className="chatWrap">
            <div className="usersConnected">
                {users.map(user => (
                    <Chip 
                        color={user === me ? 'secondary' : 'primary'}
                        key={user} 
                        avatar={<Avatar>{user[0].toUpperCase()}</Avatar>}
                        label={user}
                    />
                ))}
            </div>
            <div className="chat">
                <div className="messagesChat">
                    {chat.map((message, i) => <Message key={i} me={me} refScroll={refScroll} {...message}/>)}
                    <div ref={refScroll} />
                </div>
            </div>
            <form onSubmit={handleSubmit} noValidate autoComplete="off">
                <TextField 
                    value={msg}
                    onFocus={() => setIsWriting(true)}
                    onBlur={() => setIsWriting(false)}
                    onInput={(e) => setMessage(e.target.value)}
                    fullWidth 
                    id="standard-basic" 
                    label="Type a message..." 
                />
                <IconButton onClick={handleSubmit} color="primary" aria-label="upload picture" component="span">
                    <SendIcon />
                </IconButton>
            </form>
        </div>
    );
}

const mapStateToProps = (state) => ({
    users: readUsers(state),
    me: readName(state),
    chat: readChat(state),
    idRoom: readRoomName(state)
});

const mapDispatchToProps = (dispatch) => ({
    sendMessage: (payload) => dispatch(sendMessage(payload))
});

export default connect(mapStateToProps, mapDispatchToProps)(UsersGrid);
import {
  Input,
  Grid,
  Text,
  useColorMode,
  VStack,
} from '@chakra-ui/react';
import { forwardRef, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { useSocketEvents } from 'src/context/SocketEventsContextProvider';

import { WrapChat, ChatText } from './chat.styles';

const readChat = ({ room, user }) => ({
  name: user.name,
  color: user.color,
  comments: room.chat,
  roomId: room.id,
});

const ADMIN_COLOR = {
  light: '#64d53f',
  dark: '#64d53f',
};

function Comments({ comments }) {
  const { colorMode } = useColorMode();

  return (
    <WrapChat>
      {comments.map(({
        emitter,
        msg,
        isAdmin,
        color,
      }) => (
        <ChatText>
          {isAdmin ? (
            <Text
              color={ADMIN_COLOR[colorMode]}
              fontWeight="bolder"
            >
              {msg}
            </Text>
          ) : (
            <Text lineHeight={5}>
              <Text as="span" color={color} fontWeight="700" textAlign="left">
                {emitter}
              </Text>
              <span>: </span>
              {msg}
            </Text>
          )}
        </ChatText>
      ))}
    </WrapChat>
  );
}

const Chat = forwardRef(() => {
  const [msg, setMsg] = useState('');

  const socketEvents = useSocketEvents();
  const inputRef = useRef('');

  const {
    name,
    comments,
    roomId,
    color,
  } = useSelector(readChat);

  const sendMessage = (e) => {
    if (e.key !== 'Enter') return;
    if (!msg.replace(/ /g, '')) return;

    socketEvents.sendMessage({
      name,
      msg: msg.trim(),
      roomId,
      color,
    });

    setMsg('');
    inputRef.current.value = '';
  };

  return (
    <Grid height="100%" width="100%" templateRows="1fr 50px">

      <Comments comments={comments} />

      <VStack>
        <Input
          placeholder="Send a message"
          ref={inputRef}
          onChange={(e) => setMsg(e.target.value)}
          onKeyDown={sendMessage}
        />
      </VStack>
    </Grid>
  );
});

export default Chat;

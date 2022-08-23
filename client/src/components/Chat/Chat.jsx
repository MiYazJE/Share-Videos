import {
  forwardRef,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Input,
  Grid,
  Text,
  useColorMode,
  VStack,
  Button,
} from '@chakra-ui/react';
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

const Comments = forwardRef(({ comments, me }, ref) => {
  const { colorMode } = useColorMode();

  useEffect(() => {
    if (!ref?.current) return;
    if (comments?.length && comments[comments.length - 1].emitter !== me) return;

    ref.current.scrollIntoView({ behavior: 'smooth' });
  }, [ref, me, comments]);

  return (
    <WrapChat>
      {comments?.map(({
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
      <div ref={ref} style={{ height: 0, width: 0 }} />
    </WrapChat>
  );
});

function Chat() {
  const [msg, setMsg] = useState('');

  const socketEvents = useSocketEvents();

  const chatRef = useRef();
  const inputRef = useRef('');

  const {
    name,
    comments,
    roomId,
    color,
  } = useSelector(readChat);

  const sendMessage = () => {
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
    <Grid height="100%" width="100%" templateRows="1fr 100px">

      <Comments comments={comments} me={name} ref={chatRef} />

      <VStack alignItems="end">
        <Input
          size="lg"
          placeholder="Send a message"
          ref={inputRef}
          onChange={(e) => setMsg(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <Button
          onClick={sendMessage}
          colorScheme="facebook"
        >
          Send
        </Button>
      </VStack>
    </Grid>
  );
}

export default Chat;

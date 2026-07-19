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

const Comments = forwardRef(({ comments }, ref) => {
  const { colorMode } = useColorMode();

  useEffect(() => {
    if (!ref?.current) return;
    const chatContainer = ref.current;
    chatContainer.scrollTo({
      top: chatContainer.scrollHeight,
      behavior: 'smooth',
    });
  }, [ref, comments]);

  return (
    <WrapChat ref={ref}>
      {comments?.map(({
        emitter,
        msg,
        isAdmin,
        color,
      }, index) => (
        <ChatText key={`${emitter}-${msg}-${index}`}>
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
    <Grid height="100%" minH={0} width="100%" templateRows="minmax(0, 1fr) auto" gap={4}>

      <Comments comments={comments} ref={chatRef} />

      <VStack alignItems="stretch">
        <Input
          size="lg"
          placeholder="Send a message"
          ref={inputRef}
          onChange={(e) => setMsg(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <Button
          alignSelf="flex-end"
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

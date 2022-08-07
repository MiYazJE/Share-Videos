import { Text } from '@chakra-ui/react';
import { forwardRef } from 'react';

const Chat = forwardRef(() => (
  <Text
    css={{
      position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)',
    }}
    as="h1"
    fontSize="2xl"
  >
    Currently in development 🛠️
  </Text>
));

export default Chat;

import {
  Avatar,
  Button,
  Container,
  FormControl,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useSelector } from 'react-redux';

const getData = ({ room, user }) => ({
  users: room.users,
  roomName: room.id,
  userId: user.id,
});

function PeopleConnected() {
  const [copied, setCopied] = useState(false);

  const {
    users,
    userId,
    roomName,
  } = useSelector(getData);

  const roomUrl = `${window.location.origin}/room/${roomName}`;

  const clipBoardUrl = () => {
    navigator.clipboard.writeText(roomUrl);
    setCopied(true);
  };

  return (
    <VStack alignItems="flex-start" spacing={6}>
      <FormControl>
        <FormLabel htmlFor="shareRoom">Share room</FormLabel>
        <InputGroup>
          <Input
            onFocus={({ target }) => target.setSelectionRange(0, 100)}
            onClick={clipBoardUrl}
            value={roomUrl}
            id="shareRoom"
          />
          <InputRightElement width="4.5rem" marginRight={2}>
            <Button onClick={clipBoardUrl} colorScheme={copied ? 'green' : 'blue'} h="1.75rem" size="sm">
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <Container p={0}>
        <Text textAlign="left" fontWeight="semibold">In the room</Text>
        <VStack gap={3} paddingTop={5} width="100%">
          {users.map((user) => (
            <HStack width="100%" alignItems="center">
              <Avatar size="md" src={user.avatarBase64} />
              <VStack>
                <Text fontSize="lg">
                  {user.name}
                  {user.id === userId ? ' (You)' : ''}
                </Text>
              </VStack>
            </HStack>
          ))}
        </VStack>
      </Container>

    </VStack>
  );
}

export default PeopleConnected;

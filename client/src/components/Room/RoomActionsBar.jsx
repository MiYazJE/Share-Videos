import {
  Avatar,
  AvatarGroup,
  Badge,
  Button,
  Flex,
  HStack,
  Text,
  Tooltip,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { useState } from 'react';
import { MdExitToApp, MdLink, MdPeople } from 'react-icons/md';
import { useRoomState } from 'src/context/SocketEventsContextProvider';

import { useHistory } from 'react-router-dom';
import ChangeThemeButton from '../ChangeThemeButton';

function RoomActionsBar() {
  const [copied, setCopied] = useState(false);
  const { users, id: roomName } = useRoomState();

  const history = useHistory();
  const mutedColor = useColorModeValue('gray.600', 'whiteAlpha.700');
  const roomUrl = `${window.location.origin}/room/${roomName}`;

  const copyInvitation = async () => {
    await navigator.clipboard.writeText(roomUrl);
    setCopied(true);
  };

  return (
    <Flex
      as="header"
      width="100%"
      align={{ base: 'flex-start', md: 'center' }}
      justifyContent="space-between"
      direction={{ base: 'column', sm: 'row' }}
      gap={4}
    >
      <VStack align="flex-start" spacing={1}>
        <HStack spacing={3}>
          <Badge colorScheme="blue" borderRadius="full" px={3} py={1} letterSpacing="0.08em">
            Live room
          </Badge>
          <HStack color={mutedColor} spacing={1}>
            <MdPeople aria-hidden="true" />
            <Text fontSize="sm">
              {`${users.length} ${users.length === 1 ? 'person' : 'people'} connected`}
            </Text>
          </HStack>
        </HStack>
        <Text as="h1" fontSize={{ base: '2xl', md: '3xl' }} fontWeight="900" letterSpacing="-0.03em">
          {roomName || 'Watch together'}
        </Text>
      </VStack>
      <HStack spacing={{ base: 1, md: 2 }} flexWrap="wrap">
        {users.length ? (
          <AvatarGroup size="sm" max={4} mr={1}>
            {users.map((user) => (
              <Tooltip key={user.id} label={user.name}>
                <Avatar name={user.name} src={user.avatarBase64} />
              </Tooltip>
            ))}
          </AvatarGroup>
        ) : null}
        <Button
          aria-label="Copy room invitation link"
          onClick={copyInvitation}
          colorScheme={copied ? 'green' : 'blue'}
          variant="ghost"
          leftIcon={<MdLink />}
        >
          {copied ? 'Copied' : 'Invite'}
        </Button>
        <ChangeThemeButton size="20px" variant="ghost" />
        <Button
          aria-label="Leave room"
          onClick={() => history.push('/')}
          colorScheme="red"
          variant="ghost"
          leftIcon={<MdExitToApp />}
        >
          Leave
        </Button>
      </HStack>
    </Flex>
  );
}

export default RoomActionsBar;

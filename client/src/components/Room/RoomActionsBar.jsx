import {
  HStack,
  IconButton,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import {
  MdPeople,
  MdChat,
  MdPlaylistPlay,
  MdYoutubeSearchedFor,
} from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';

import { ROOM_MODALS } from 'src/enums';

const getData = ({ room }) => ({
  users: room.users,
  roomName: room.id,
});

function RoomActionsBar() {
  const {
    users,
    roomName,
  } = useSelector(getData);

  const dispatch = useDispatch();

  const createToggleShowModal = (type) => () => {
    dispatch.room.SET_PROP({ activeModal: type });
  };

  return (
    <HStack
      width="100%"
      justifyContent="space-between"
    >
      <HStack>
        <Text fontSize="lg" fontWeight="semibold">
          {roomName}
          {' '}
          |
          {' '}
          {`${users.length} ${users.length === 1 ? 'user' : 'users'} connected` }
        </Text>
      </HStack>
      <HStack>
        <Tooltip label="People">
          <IconButton
            onClick={createToggleShowModal(ROOM_MODALS.PEOPLE)}
            colorScheme="facebook"
            rounded="full"
            icon={<MdPeople />}
          />
        </Tooltip>

        <Tooltip label="Chat">
          <IconButton
            onClick={createToggleShowModal(ROOM_MODALS.CHAT)}
            colorScheme="facebook"
            rounded="full"
            icon={<MdChat />}
          />
        </Tooltip>

        <Tooltip label="Playlist">
          <IconButton
            onClick={createToggleShowModal(ROOM_MODALS.PLAYLIST)}
            colorScheme="facebook"
            rounded="full"
            icon={<MdPlaylistPlay />}
          />
        </Tooltip>

        <Tooltip label="Search videos">
          <IconButton
            onClick={createToggleShowModal(ROOM_MODALS.SEARCH)}
            colorScheme="facebook"
            rounded="full"
            icon={<MdYoutubeSearchedFor />}
          />
        </Tooltip>
      </HStack>
    </HStack>
  );
}

export default RoomActionsBar;

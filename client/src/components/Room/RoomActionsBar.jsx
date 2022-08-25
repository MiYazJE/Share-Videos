import {
  HStack,
  IconButton,
  Stack,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import {
  MdInfoOutline,
  MdChat,
  MdPlaylistPlay,
  MdSearch,
  MdExitToApp,
} from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';

import { ROOM_MODALS } from 'src/enums';
import { useHistory } from 'react-router-dom';
import ChangeThemeButton from '../ChangeThemeButton';

const ICON_SIZE = '25px';

const getData = ({ room }) => ({
  users: room.users,
  roomName: room.id,
});

function RoomActionsBar() {
  const {
    users,
    roomName,
  } = useSelector(getData);

  const history = useHistory();
  const dispatch = useDispatch();

  const createToggleShowModal = (type) => () => {
    dispatch.room.SET_PROP({ activeModal: type });
  };

  return (
    <Stack
      width="100%"
      flexDirection={{
        base: 'column',
        md: 'row',
      }}
      gap={1}
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
        <Tooltip label="Details of the room">
          <IconButton
            onClick={createToggleShowModal(ROOM_MODALS.PEOPLE)}
            colorScheme="facebook"
            variant="teal"
            icon={<MdInfoOutline size={ICON_SIZE} />}
          />
        </Tooltip>

        <Tooltip label="Chat">
          <IconButton
            onClick={createToggleShowModal(ROOM_MODALS.CHAT)}
            colorScheme="facebook"
            variant="teal"
            icon={<MdChat size={ICON_SIZE} />}
          />
        </Tooltip>

        <Tooltip label="Playlist">
          <IconButton
            onClick={createToggleShowModal(ROOM_MODALS.PLAYLIST)}
            colorScheme="facebook"
            variant="teal"
            icon={<MdPlaylistPlay size={ICON_SIZE} />}
          />
        </Tooltip>

        <Tooltip label="Search videos">
          <IconButton
            onClick={createToggleShowModal(ROOM_MODALS.SEARCH)}
            colorScheme="facebook"
            variant="teal"
            icon={<MdSearch size={ICON_SIZE} />}
          />
        </Tooltip>

        <ChangeThemeButton size={ICON_SIZE} variant="teal" />

        <Tooltip label="Leave">
          <IconButton
            onClick={() => history.push('/')}
            color="red"
            variant="teal"
            icon={<MdExitToApp size={ICON_SIZE} />}
          />
        </Tooltip>
      </HStack>
    </Stack>
  );
}

export default RoomActionsBar;

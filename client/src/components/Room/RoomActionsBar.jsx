import { HStack, IconButton } from '@chakra-ui/react';
import {
  MdPeople,
  MdChat,
  MdPlaylistPlay,
  MdYoutubeSearchedFor,
} from 'react-icons/md';
import { useDispatch } from 'react-redux';

import { ROOM_MODALS } from 'src/enums';

function RoomActionsBar() {
  const dispatch = useDispatch();

  const createToggleShowModal = (type) => () => {
    dispatch.room.SET_PROP({ activeModal: type });
  };

  return (
    <HStack
      width="100%"
      justifyContent="flex-end"
    >
      <IconButton
        onClick={createToggleShowModal(ROOM_MODALS.PEOPLE)}
        colorScheme="facebook"
        icon={<MdPeople />}
      />
      <IconButton
        onClick={createToggleShowModal(ROOM_MODALS.CHAT)}
        colorScheme="facebook"
        icon={<MdChat />}
      />
      <IconButton
        onClick={createToggleShowModal(ROOM_MODALS.PLAYLIST)}
        colorScheme="facebook"
        icon={<MdPlaylistPlay />}
      />
      <IconButton
        onClick={createToggleShowModal(ROOM_MODALS.SEARCH)}
        colorScheme="facebook"
        icon={<MdYoutubeSearchedFor />}
      />
    </HStack>
  );
}

export default RoomActionsBar;

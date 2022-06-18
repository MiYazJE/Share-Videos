import { useDispatch, useSelector } from 'react-redux';

import { ROOM_MODALS } from 'src/enums';

import RoomNameModal from 'src/components/Room/RoomNameModal';
import SearchVideoModal from 'src/components/Room/SearchVideoModal';
import PeopleModal from 'src/components/Room/PeopleModal';
import ChatModal from 'src/components/Room/ChatModal';
import SharedPlaylistModal from 'src/components/Room/SharedPlaylistModal';

const MODAL_SIZES = {
  DESKTOP: 'lg',
  MOBILE: 'full',
};

function RoomModals({
  showNameModal,
  onCloseNameModal,
  onAcceptNameModal,
}) {
  const activeModal = useSelector((state) => state.room.activeModal);
  const dispatch = useDispatch();

  const onCloseModal = () => {
    dispatch.room.SET_PROP({ activeModal: null });
  };

  return (
    <>
      <RoomNameModal
        open={showNameModal}
        onCancel={onCloseNameModal}
        onAccept={onAcceptNameModal}
      />
      <SearchVideoModal
        isOpen={activeModal === ROOM_MODALS.SEARCH}
        onClose={onCloseModal}
        size={MODAL_SIZES.DESKTOP}
        title="Add videos to shared playlist 🚀"
      />
      <PeopleModal
        isOpen={activeModal === ROOM_MODALS.PEOPLE}
        onClose={onCloseModal}
        size={MODAL_SIZES.DESKTOP}
        title="People in the room"
      />
      <ChatModal
        isOpen={activeModal === ROOM_MODALS.CHAT}
        onClose={onCloseModal}
        size={MODAL_SIZES.DESKTOP}
        title="Chat 🧑‍🤝‍🧑"
      />
      <SharedPlaylistModal
        isOpen={activeModal === ROOM_MODALS.PLAYLIST}
        onClose={onCloseModal}
        size={MODAL_SIZES.DESKTOP}
        title="Shared playlist"
      />
    </>
  );
}

export default RoomModals;

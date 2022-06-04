import { useDispatch, useSelector } from 'react-redux';
import RoomNameModal from 'src/components/Room/RoomNameModal';
import SearchVideoModal from 'src/components/Room/SearchVideoModal';
import { ROOM_MODALS } from 'src/enums';

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
    </>
  );
}

export default RoomModals;

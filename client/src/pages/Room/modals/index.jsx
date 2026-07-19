import RoomNameModal from 'src/components/Room/RoomNameModal';

function RoomModals({
  showNameModal,
  onCloseNameModal,
  onAcceptNameModal,
}) {
  return (
    <RoomNameModal
      open={showNameModal}
      onCancel={onCloseNameModal}
      onAccept={onAcceptNameModal}
    />
  );
}

export default RoomModals;

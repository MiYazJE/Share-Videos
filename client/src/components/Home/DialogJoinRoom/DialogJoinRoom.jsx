import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  ModalCloseButton,
  Button,
  Container,
} from '@chakra-ui/react';

import useRoom from 'src/hooks/useRoom';

function DialogJoinRoom({
  open,
  onClose,
}) {
  const [idRoom, setIdRoom] = useState('');
  const [errorRoomId, setErrorRoomId] = useState('');

  const roomValidation = useRoom({ id: idRoom });
  const { isValidRoom } = roomValidation;

  const history = useHistory();

  useEffect(() => {
    if (!idRoom) return;
    if (roomValidation.isSuccess && !isValidRoom) setErrorRoomId('Room does not exist');
    if (roomValidation.isSuccess && isValidRoom) setErrorRoomId('');
    if (roomValidation.isError) setErrorRoomId('Unable to validate the room. Try again.');
  }, [isValidRoom, idRoom, roomValidation.isSuccess, roomValidation.isError]);

  const handleJoinRoom = () => {
    if (!idRoom) return setErrorRoomId('Room is empty');
    if (roomValidation.isError) return roomValidation.refetch();
    if (roomValidation.isPending) return;
    if (!isValidRoom) return;

    history.push(`/room/${idRoom}`);
    onClose();
  };

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      size="md"
      isCentered
    >
      <ModalOverlay />

      <ModalContent>
        <ModalHeader>Join room 🚀</ModalHeader>
        <ModalCloseButton />
        <Container p={4}>
          <FormControl isInvalid={errorRoomId}>
            <FormLabel htmlFor="roomId">Room</FormLabel>
            <Input
              autoFocus
              id="roomId"
              type="text"
              placeholder="Enter the room"
              errorBorderColor="red.300"
              onChange={({ target }) => setIdRoom(target.value)}
            />
            <FormErrorMessage>
              {errorRoomId && errorRoomId}
            </FormErrorMessage>
          </FormControl>
        </Container>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Close
          </Button>
          <Button
            colorScheme="facebook"
            onClick={handleJoinRoom}
            isLoading={roomValidation.isFetching}
            isDisabled={!idRoom}
          >
            {roomValidation.isError ? 'Retry' : 'Join'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default DialogJoinRoom;

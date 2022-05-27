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

  const { isValidRoom } = useRoom({ id: idRoom });

  const history = useHistory();

  useEffect(() => {
    if (!idRoom) setErrorRoomId('Room is empty');
    else if (!isValidRoom) setErrorRoomId(`Room ${idRoom} not exists`);
  }, [isValidRoom, idRoom]);

  const handleJoinRoom = () => {
    if (!idRoom || !isValidRoom) return;

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
              errorBorderColor={errorRoomId}
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
          >
            Join
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default DialogJoinRoom;

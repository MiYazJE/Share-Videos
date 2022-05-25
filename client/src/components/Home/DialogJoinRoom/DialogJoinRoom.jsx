import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

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

import { isValidRoom } from '../../../actions/roomActions';

// todo: room is loading
const readSelectors = ({ user }) => ({
  isLoading: false,
  name: user.name,

});

function DialogJoinRoom({
  open,
  onClose,
}) {
  const { name, isLoading } = useSelector(readSelectors);
  const [idRoom, setIdRoom] = useState('');
  const [errorRoomId, setErrorRoomId] = useState('');

  const dispatch = useDispatch();
  const history = useHistory();

  const handleJoinRoom = async () => {
    // if (!idRoom) return setErrorRoomId('Room is empty');

    // const isValid = await dispatch(isValidRoom(idRoom));
    // if (!isValid) setErrorRoomId('The room is not valid');
    // else {
    //   history.push(`/room/${idRoom}`);
    //   onClose();
    // }
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
            isLoading={isLoading}
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

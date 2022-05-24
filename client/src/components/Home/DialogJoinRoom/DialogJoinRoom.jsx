import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { connect, useDispatch } from 'react-redux';

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

import { readIsLoading } from '../../../reducers/roomReducer';
import { isValidRoom } from '../../../actions/roomActions';
import { readName } from '../../../reducers/userReducer';

function DialogJoinRoom({
  open,
  onClose,
  isLoading,
}) {
  const [idRoom, setIdRoom] = useState('');
  const [errorRoomId, setErrorRoomId] = useState('');

  const dispatch = useDispatch();
  const history = useHistory();

  const handleJoinRoom = async () => {
    if (!idRoom) return setErrorRoomId('Room is empty');

    const isValid = await dispatch(isValidRoom(idRoom));
    if (!isValid) setErrorRoomId('The room is not valid');
    else {
      history.push(`/room/${idRoom}`);
      onClose();
    }
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
          <Button
            colorScheme="blue"
            mr={3}
            isLoading={isLoading}
            onClick={handleJoinRoom}
          >
            Join
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

const mapStateToProps = (state) => ({
  name: readName(state),
  isLoading: readIsLoading(state),
});

const mapDispatchToProps = (dispatch) => ({
  isValidRoom: (id) => dispatch(isValidRoom(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DialogJoinRoom);

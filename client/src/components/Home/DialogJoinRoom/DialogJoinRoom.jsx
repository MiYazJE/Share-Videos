import {
  useEffect,
  useRef,
  useState,
} from 'react';
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

import { validateRoom } from 'src/api/rooms';

const ROOM_NOT_FOUND_MESSAGE = 'Room does not exist';
const VALIDATION_FAILURE_MESSAGE = 'Unable to validate the room. Try again.';

function DialogJoinRoom({
  open,
  onClose,
}) {
  const [idRoom, setIdRoom] = useState('');
  const [errorRoomId, setErrorRoomId] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [canRetry, setCanRetry] = useState(false);
  const isOpenRef = useRef(open);
  const isRequestPendingRef = useRef(false);
  const requestVersionRef = useRef(0);

  const history = useHistory();

  useEffect(() => {
    isOpenRef.current = open;
  }, [open]);

  useEffect(() => () => {
    isOpenRef.current = false;
    requestVersionRef.current += 1;
  }, []);

  const handleClose = () => {
    isOpenRef.current = false;
    isRequestPendingRef.current = false;
    requestVersionRef.current += 1;
    setIsValidating(false);
    setErrorRoomId('');
    setCanRetry(false);
    onClose();
  };

  const handleRoomIdChange = ({ target }) => {
    setIdRoom(target.value);
    setErrorRoomId('');
    setCanRetry(false);
  };

  const handleJoinRoom = async () => {
    if (isRequestPendingRef.current) return;

    const normalizedRoomId = idRoom.trim();
    if (!normalizedRoomId) {
      setErrorRoomId('Room is empty');
      setCanRetry(false);
      return;
    }

    const requestVersion = requestVersionRef.current + 1;
    requestVersionRef.current = requestVersion;
    isRequestPendingRef.current = true;
    setIsValidating(true);
    setErrorRoomId('');
    setCanRetry(false);

    const requestIsCurrent = () => (
      isOpenRef.current && requestVersionRef.current === requestVersion
    );

    try {
      const roomExists = await validateRoom({ id: normalizedRoomId });
      if (!requestIsCurrent()) return;

      if (typeof roomExists !== 'boolean') {
        setErrorRoomId(VALIDATION_FAILURE_MESSAGE);
        setCanRetry(true);
        return;
      }

      if (!roomExists) {
        setErrorRoomId(ROOM_NOT_FOUND_MESSAGE);
        return;
      }

      handleClose();
      history.push(`/room/${normalizedRoomId}`);
    } catch {
      if (!requestIsCurrent()) return;
      setErrorRoomId(VALIDATION_FAILURE_MESSAGE);
      setCanRetry(true);
    } finally {
      if (requestIsCurrent()) {
        isRequestPendingRef.current = false;
        setIsValidating(false);
      }
    }
  };

  return (
    <Modal
      isOpen={open}
      onClose={handleClose}
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
              value={idRoom}
              onChange={handleRoomIdChange}
            />
            <FormErrorMessage>
              {errorRoomId && errorRoomId}
            </FormErrorMessage>
          </FormControl>
        </Container>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={handleClose}>
            Close
          </Button>
          <Button
            colorScheme="facebook"
            onClick={handleJoinRoom}
            isLoading={isValidating}
            isDisabled={isValidating}
          >
            {canRetry ? 'Retry' : 'Join'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default DialogJoinRoom;

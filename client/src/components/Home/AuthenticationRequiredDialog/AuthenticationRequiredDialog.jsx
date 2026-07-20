import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';

function AuthenticationRequiredDialog({
  open,
  onClose,
  onLogin,
  onRegister,
}) {
  return (
    <Modal isOpen={open} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Sign in to create a room</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>
            Only registered users can create rooms. You can still join a room as a guest.
          </Text>
        </ModalBody>
        <ModalFooter gap={3}>
          <Button variant="ghost" onClick={onClose}>Not now</Button>
          <Button variant="outline" colorScheme="facebook" onClick={onLogin}>Login</Button>
          <Button colorScheme="facebook" onClick={onRegister}>Register</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default AuthenticationRequiredDialog;

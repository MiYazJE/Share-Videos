import {
  Button,
  Modal,
  Input,
  ModalOverlay,
  ModalFooter,
  ModalHeader,
  ModalContent,
  ModalCloseButton,
  VStack,
  FormLabel,
  FormControl,
  FormErrorMessage,
} from '@chakra-ui/react';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

const schema = Yup.object().shape({
  name: Yup.string().required('Nickname is empty'),
});

function RoomNameModal({
  open,
  onAccept,
  onCancel,
}) {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    onAccept(data.name);
  };

  return (
    <Modal
      isOpen={open}
      onClose={onCancel}
      size="md"
      isCentered
    >
      <ModalOverlay />

      <ModalContent>
        <ModalHeader>Enter your nickname</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack p={6}>
            <FormControl isInvalid={errors.name}>
              <FormLabel htmlFor="name">Nickname</FormLabel>
              <Input
                autoFocus
                errorBorderColor="red.300"
                placeholder="Enter your nickname"
                {...register('name')}
              />
              <FormErrorMessage>
                {errors.name && errors.name.message}
              </FormErrorMessage>
            </FormControl>
          </VStack>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onCancel}>
              Exit
            </Button>
            <Button
              colorScheme="facebook"
              type="submit"
            >
              Join
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}

export default RoomNameModal;

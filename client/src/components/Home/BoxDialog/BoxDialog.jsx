import {
  Button,
  Heading,
  Input,
  Text,
  VStack,
  Flex,
  Container,
  FormErrorMessage,
  FormControl,
} from '@chakra-ui/react';
import { useState } from 'react';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import DialogJoinRoom from 'src/components/Home/DialogJoinRoom/DialogJoinRoom';

const yupSchema = Yup.object().shape({
  nickName: Yup.string()
    .required('Nickname is empty'),
});

function BoxDialog({ onCreateRoom, isLoading }) {
  const [openDialogJoinRoom, setOpenDialogJoinRoom] = useState(false);

  const {
    handleSubmit,
    formState: { errors },
    register,
  } = useForm({
    resolver: yupResolver(yupSchema),
  });

  return (
    <form onSubmit={handleSubmit(onCreateRoom)}>
      <VStack p={10} boxSize="100%">
        <Container maxW="container.xl">
          <Heading textAlign="center" color="gray.700">
            View videos with
            {' '}
            <Text color="facebook.500">FRIENDS</Text>
          </Heading>
        </Container>
        <Container maxW="400px">
          <Text>
            Share Videos is the perfect website to view youtube videos in real time with friends.
          </Text>
          <Text>What are you waiting for? Join and enjoy 🚀</Text>
        </Container>
        <Container pt={35}>
          <VStack spacing={6} alignItems="flex-start">
            <FormControl isInvalid={errors.nickName}>
              <Input
                placeholder="Enter your nickname"
                errorBorderColor="red.300"
                {...register('nickName')}
              />
              <FormErrorMessage>
                {errors.nickName && errors.nickName.message}
              </FormErrorMessage>
            </FormControl>
            <Flex gap={6}>
              <Button
                colorScheme="facebook"
                type="submit"
                isLoading={isLoading}
              >
                Create room
              </Button>
              <Button colorScheme="facebook" variant="link" onClick={() => setOpenDialogJoinRoom(true)}>
                Or join a room
              </Button>
            </Flex>
          </VStack>
        </Container>
        <DialogJoinRoom
          open={openDialogJoinRoom}
          onClose={() => setOpenDialogJoinRoom(false)}
        />
      </VStack>
    </form>
  );
}

export default BoxDialog;

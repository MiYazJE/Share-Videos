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
  FormLabel,
  useColorMode,
  HStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import { AiFillYoutube } from 'react-icons/ai';

import DialogJoinRoom from 'src/components/Home/DialogJoinRoom/DialogJoinRoom';

const readUser = ({ user }) => ({
  name: user.name,
  isLogged: user.isLogged,
});

const yupSchema = Yup.object().shape({
  nickName: Yup.string()
    .required('Nickname is empty'),
});

function BoxDialog({ onCreateRoom, isLoading }) {
  const [openDialogJoinRoom, setOpenDialogJoinRoom] = useState(false);
  const { colorMode } = useColorMode();
  const titleColor = useColorModeValue('blue.500', 'blue.300');

  const {
    name,
    isLogged,
  } = useSelector(readUser);

  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(yupSchema),
  });

  useEffect(() => {
    if (name) {
      setValue('nickName', name);
    }
  }, [name, setValue]);

  return (
    <form onSubmit={handleSubmit(onCreateRoom)}>
      <VStack p={10} gap={10} boxSize="100%">
        <Container maxW="container.xl" px={10}>
          <Heading size="3xl" textAlign="center" color={colorMode !== 'dark' && 'gray.700'}>
            <HStack justifyContent="center"><AiFillYoutube fill="#FF0000" /></HStack>
            View videos with
            {' '}
            <Heading as="span" color={titleColor} size="3xl">FRIENDS</Heading>
          </Heading>
        </Container>
        <Container maxW="container.xxl">
          <Text textAlign="center" fontSize="20px">
            Share Videos is the perfect website to view youtube videos in real time with friends.
            {' '}
            <br />
            What are you waiting for? Join and enjoy 🚀
          </Text>
        </Container>
        <Container>
          <VStack spacing={6} alignItems="flex-start">
            <FormControl isInvalid={errors.nickName}>
              <FormLabel htmlFor="nickName">Nickname</FormLabel>
              <Input
                placeholder="Enter your nickname"
                errorBorderColor="red.300"
                {...register('nickName')}
                id="nickName"
                isDisabled={isLogged}
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
                Or join room
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

import { useCallback, useEffect, useState } from 'react';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
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
  VStack,
  InputRightElement,
  InputGroup,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';

const schema = Yup.object().shape({
  name: Yup.string()
    .required('Nickname is empty'),
  password: Yup.string()
    .required('Password is empty'),
});

const readIsLoggedIn = ({ user }) => user.isLogged;

function Login({
  loading,
  onClose,
  open,
  onLogin,
}) {
  const isLoggedIn = useSelector(readIsLoggedIn);
  const [showPassword, setShowPassword] = useState(false);

  const {
    handleSubmit,
    formState: { errors },
    reset,
    register,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const closeWithReset = useCallback(() => {
    reset({});
    onClose();
  }, [reset, onClose]);

  useEffect(() => {
    if (isLoggedIn) closeWithReset();
  }, [isLoggedIn, closeWithReset]);

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      size="md"
      isCentered
    >

      <ModalOverlay />

      <form onSubmit={handleSubmit(onLogin)}>
        <ModalContent>
          <ModalHeader>Login 🎵</ModalHeader>
          <ModalCloseButton />
          <VStack p={4} spacing={3}>
            <FormControl isInvalid={errors?.name}>
              <FormLabel htmlFor="name">Nickname</FormLabel>
              <Input
                id="name"
                autoFocus
                {...register('name')}
                placeholder="Enter your nickname"
                errorBorderColor="red.300"
              />
              <FormErrorMessage>
                {errors?.name?.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={errors?.password}>
              <FormLabel htmlFor="password">Password</FormLabel>
              <InputGroup>
                <Input
                  id="password"
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  errorBorderColor="red.300"
                />
                <InputRightElement width="4.5rem">
                  <Button h="1.75rem" size="sm" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? 'Hide' : 'Show'}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>
                {errors?.password?.message}
              </FormErrorMessage>
            </FormControl>
          </VStack>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button
              colorScheme="facebook"
              isLoading={loading}
              type="submit"
            >
              Login
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
}

export default Login;

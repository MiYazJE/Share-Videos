import { useCallback, useEffect, useState } from 'react';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
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
import { useSelector } from 'react-redux';

const schema = Yup.object().shape({
  name: Yup.string()
    .required('Nickname is empty'),
  password: Yup.string()
    .required('Password is empty'),
  repeatPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Password is empty'),
});

const readIsLoggedIn = ({ user }) => user.isLogged;

function Register({
  open,
  onClose,
  onRegister,
  loading,
}) {
  const isLoggedIn = useSelector(readIsLoggedIn);

  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

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

      <form onSubmit={handleSubmit(onRegister)}>
        <ModalContent>
          <ModalHeader>Register 🎵</ModalHeader>
          <ModalCloseButton />
          <VStack p={4} spacing={3}>
            <FormControl isInvalid={errors?.name}>
              <FormLabel htmlFor="name">Nickname</FormLabel>
              <Input
                tabIndex={0}
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
            <FormControl isInvalid={errors?.password || errors.repeatPassword}>
              <FormLabel htmlFor="password">Password</FormLabel>
              <InputGroup>
                <Input
                  id="password"
                  tabIndex={0}
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  errorBorderColor="red.300"
                />
                <InputRightElement tabIndex={-1} width="4.5rem">
                  <Button h="1.75rem" size="sm" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? 'Hide' : 'Show'}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>
                {errors?.password?.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={errors?.repeatPassword}>
              <FormLabel htmlFor="repeatPassword">Repeat password</FormLabel>
              <InputGroup>
                <Input
                  tabIndex={0}
                  id="repeatPassword"
                  {...register('repeatPassword')}
                  type={showRepeatPassword ? 'text' : 'password'}
                  placeholder="Repeat password"
                  errorBorderColor="red.300"
                />
                <InputRightElement tabIndex={-1} width="4.5rem">
                  <Button h="1.75rem" size="sm" onClick={() => setShowRepeatPassword(!showRepeatPassword)}>
                    {showRepeatPassword ? 'Hide' : 'Show'}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>
                {errors?.repeatPassword?.message}
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
              Register
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
}

export default Register;

import { useEffect, useState } from 'react';
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
  nameOrEmail: Yup.string()
    .required('Nickname or email is empty'),
  password: Yup.string()
    .required('Password is empty'),
});

const readIsLoggedIn = ({ user }) => ({
  isLoggedIn: user.isLogged,
});

function Login({
  loading,
  onClose,
  open,
  onLogin,
}) {
  const { isLoggedIn } = useSelector(readIsLoggedIn);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isLoggedIn) onClose();
  }, [isLoggedIn, onClose]);

  const {
    handleSubmit,
    formState: { errors },
    register,
  } = useForm({
    resolver: yupResolver(schema),
  });

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      size="md"
      isCentered
    >

      <ModalOverlay />

      <ModalContent>
        <ModalHeader>Login 🎵</ModalHeader>
        <ModalCloseButton />
        <VStack p={4} spacing={3}>
          <FormControl isInvalid={errors?.nameOrEmail}>
            <FormLabel htmlFor="nameOrEmail">Nickname or email</FormLabel>
            <Input
              id="nameOrEmail"
              autoFocus
              {...register('nameOrEmail')}
              placeholder="Enter your nickname or email"
              errorBorderColor="red.300"
            />
            <FormErrorMessage>
              {errors?.nameOrEmail?.message}
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
            onClick={handleSubmit(onLogin)}
          >
            Login
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default Login;

import {
  Button,
  Heading,
  Text,
  VStack,
  Flex,
  Container,
  useColorMode,
  HStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { useState } from 'react';
import { AiFillYoutube } from 'react-icons/ai';

import DialogJoinRoom from 'src/components/Home/DialogJoinRoom/DialogJoinRoom';

function BoxDialog({ onCreateRoom, isLoading, isCreateDisabled }) {
  const [openDialogJoinRoom, setOpenDialogJoinRoom] = useState(false);
  const { colorMode } = useColorMode();
  const titleColor = useColorModeValue('blue.500', 'blue.300');

  return (
    <div data-test-id="homeActions">
      <VStack p={10} gap={10} boxSize="100%">
        <Container maxW="container.xl" px={10}>
          <Heading size="3xl" textAlign="center" color={colorMode !== 'dark' && 'gray.700'}>
            <HStack justifyContent="center"><AiFillYoutube fill="#FF0000" /></HStack>
            Watch videos with
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
            <Flex gap={6}>
              <Button
                colorScheme="facebook"
                onClick={onCreateRoom}
                isLoading={isLoading}
                isDisabled={isCreateDisabled}
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
    </div>
  );
}

export default BoxDialog;

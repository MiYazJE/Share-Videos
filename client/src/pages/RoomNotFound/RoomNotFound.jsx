import {
  Grid,
  Text,
  Heading,
  VStack,
  useColorModeValue,
  Link,
} from '@chakra-ui/react';
import { useParams, Link as RouterLink } from 'react-router-dom';

function RoomNotFound() {
  const { id } = useParams();
  const titleColor = useColorModeValue('facebook.500', 'blue.300');
  const backgroundRoomId = useColorModeValue('facebook.500', 'blue.500');

  return (
    <VStack justifyContent="center" alignItems="center" h="100vh">
      <Grid
        w={{
          base: '100%',
          md: '80%',
        }}
        p={{
          base: 5,
          md: 0,
        }}
      >
        <VStack alignItems="start" gap={5}>
          <Heading color={titleColor} size="4xl">
            404
          </Heading>
          <Heading size="xl" lineHeight="4xl">
            Ooops! Room
            <Text
              as="span"
              mx={2}
              backgroundColor={backgroundRoomId}
              rounded="full"
              color="white"
              px={3}
            >
              {id}
            </Text>
            does not exists!
          </Heading>
          <Text fontSize="2xl">
            Return to
            {' '}
            <Link as={RouterLink} textDecoration="underline" to="/">home</Link>
            {' '}
            page and try again
          </Text>
        </VStack>
      </Grid>
    </VStack>
  );
}

export default RoomNotFound;

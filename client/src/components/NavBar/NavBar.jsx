import { Link } from 'react-router-dom';
import styled from 'styled-components';
import {
  Box,
  HStack,
  Skeleton,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { useSession } from 'src/context/SessionContextProvider';

import AuthenticationNav from './AuthenticationNav/AuthenticationNav';

const StyledLink = styled(Link)`
  font-weight: bold;
  font-size: 30px;
  text-decoration: none;
  &:hover {
    text-decoration: none;
  }
`;

function NavBar({ openLogin, openRegister }) {
  const { sessionQuery } = useSession();
  const isLoadingUser = sessionQuery.isPending || sessionQuery.isFetching;
  const titleColor = useColorModeValue('blue.500', 'blue.300');

  return (
    <HStack width="100%" p={3} position="sticky" justifyContent="space-between">
      <StyledLink to="/">
        <Text as="span" color={titleColor}>
          Share Videos
        </Text>
      </StyledLink>
      {isLoadingUser ? (
        <Box width="220px" height="100%">
          <Skeleton height="100%" />
        </Box>
      ) : (
        <AuthenticationNav openLogin={openLogin} openRegister={openRegister} />
      )}
    </HStack>
  );
}

export default NavBar;

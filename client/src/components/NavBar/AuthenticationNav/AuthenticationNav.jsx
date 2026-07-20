import {
  Button,
  MenuButton,
  Menu,
  MenuList,
  MenuItem,
  ButtonGroup,
  Avatar,
  Spinner,
  HStack,
} from '@chakra-ui/react';

import ChangeThemeButton from 'src/components/ChangeThemeButton';
import { useSession } from 'src/context/SessionContextProvider';

function AuthenticationNav({
  openLogin,
  openRegister,
}) {
  const { user, logout, sessionQuery } = useSession();
  const { isLogged, name, avatarBase64 } = user;
  const loadingAuth = sessionQuery.isFetching;

  if (loadingAuth) return <Spinner />;

  return (
    <HStack>
      {isLogged ? (
        <Menu>
          <MenuButton
            variant="outline"
            as={Button}
            rightIcon={(
              <Avatar size="sm" name={name} src={avatarBase64} />
            )}
          >
            Welcome
            {' '}
            {name}
          </MenuButton>
          <MenuList>
            <MenuItem onClick={logout}>Logout</MenuItem>
          </MenuList>
        </Menu>
      ) : (
        <ButtonGroup spacing={2}>
          <Button
            variant="outline"
            colorScheme="facebook"
            onClick={openLogin}
          >
            LOGIN
          </Button>
          <Button
            variant="solid"
            colorScheme="facebook"
            onClick={openRegister}
          >
            REGISTER
          </Button>
        </ButtonGroup>
      )}
      <ChangeThemeButton variant="teal" />
    </HStack>
  );
}

export default AuthenticationNav;

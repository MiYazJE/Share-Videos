import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  MenuButton,
  Menu,
  MenuList,
  MenuItem,
  ButtonGroup,
  Avatar,
  Spinner,
} from '@chakra-ui/react';

const readSelectors = ({ user, loading }) => ({
  isLogged: user.isLogged,
  name: user.name,
  avatarBase64: user.avatarBase64,
  loadingAuth: loading.effects.user.whoAmI || loading.effects.user.login,
});

function AuthenticationNav({
  openLogin,
  openRegister,
}) {
  const dispatch = useDispatch();
  const {
    isLogged,
    name,
    avatarBase64,
    loadingAuth,
  } = useSelector(readSelectors);

  if (loadingAuth) return <Spinner />;

  return (
    isLogged
      ? (
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
            <MenuItem onClick={dispatch.user.logout}>Logout</MenuItem>
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
      )
  );
}

export default AuthenticationNav;

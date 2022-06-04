import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  MenuButton,
  Menu,
  MenuList,
  MenuItem,
  ButtonGroup,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';

const readSelectors = ({ user }) => ({
  isLogged: user.isLogged,
  name: user.name,
});

function AuthenticationNav({
  openLogin,
  openRegister,
}) {
  const dispatch = useDispatch();
  const { isLogged, name } = useSelector(readSelectors);

  return (
    isLogged
      ? (
        <Menu>
          <MenuButton
            variant="outline"
            as={Button}
            rightIcon={<ChevronDownIcon />}
          >
            Welcome
            {' '}
            {name}
          </MenuButton>
          <MenuList>
            <MenuItem nClick={dispatch.user.logout}>Logout</MenuItem>
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

import { useState } from 'react';
import { Button, Menu, MenuItem } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';

const readSelectors = ({ user }) => ({
  isLogged: user.isLogged,
  name: user.name,
});

function AuthenticationNav({
  openLogin,
  openRegister,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();
  const { isLogged, name } = useSelector(readSelectors);

  const handleClick = (e) => setAnchorEl(e.currentTarget);

  const handleClose = () => setAnchorEl(null);

  return (
    <div id="wrapLogin">
      {isLogged
        ? (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <h3 style={{ marginRight: '0px' }}>Welcome</h3>
            <Button
              aria-haspopup="true"
              aria-controls="simple-menu"
              onClick={handleClick}
              size="small"
              style={{
                color: 'green', fontWeight: 'bold', marginTop: '13px', fontSize: '15px',
              }}
            >
              {name}
            </Button>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
              style={{ marginTop: '50px' }}
            >
              <MenuItem onClick={dispatch.user.logout}>Logout</MenuItem>
            </Menu>
          </div>
        ) : (
          <>
            <Button
              size="medium"
              style={{ color: 'white' }}
              onClick={openLogin}
            >
              LOGIN
            </Button>
            <Button
              size="medium"
              style={{ color: 'white' }}
              onClick={openRegister}
            >
              REGISTER
            </Button>
          </>
        )}
    </div>
  );
}

export default AuthenticationNav;

import React, { useState } from 'react';
import { Button, Menu, MenuItem } from '@material-ui/core';
import { connect } from 'react-redux';
import { logout } from '../../actions/userActions';
import { readName, readIsLogged } from '../../reducers/userReducer';

const AuthenticationNav = ({ isLogged, name, openRegister, openLogin, logout }) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (e) => setAnchorEl(e.currentTarget);

    const handleClose = () => setAnchorEl(null);

    return (
        <div id="wrapLogin">
            {isLogged
                ? (
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <h3 style={{marginRight: '0px'}}>Welcome</h3>
                        <Button
                            aria-haspopup="true"
                            aria-controls="simple-menu"
                            onClick={handleClick}
                            size="small"
                            style={{color: 'green', fontWeight: 'bold', marginTop: '13px', fontSize: '15px'}}
                        >
                            {name}
                        </Button>
                        <Menu
                            id="simple-menu"
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                            style={{marginTop: '50px'}}
                        >
                            <MenuItem onClick={logout}>Logout</MenuItem>
                        </Menu>
                    </div>
                ) : (
                    <>
                        <Button
                            variant="outlined"
                            size="medium"
                            onClick={openLogin}
                        >
                            LOGIN
                        </Button>
                        <Button
                            variant="outlined"
                            color="secondary"
                            size="medium"
                            onClick={openRegister}
                        >
                            REGISTER
                        </Button>
                    </>
                )}
        </div>
    );
};

const mapStateToProps = (state) => ({
    name: readName(state),
    isLogged: readIsLogged(state),
});

const mapDispatchToProps = (dispatch) => ({
    logout: () => dispatch(logout()),
});

export default connect(mapStateToProps, mapDispatchToProps)(AuthenticationNav);
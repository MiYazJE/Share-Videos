import React, { useEffect, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Button } from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import { IconButton, OutlinedInput } from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import { connect } from 'react-redux';
import { closeModal } from '../../actions/modalActions';
import { readFormErrors, readIsLoading } from '../../reducers/userReducer';
import { clearFormErrors, login } from '../../actions/userActions';
import './login.scss';

const Login = ({ loading, login, closeModal, formErrors, clearFormErrors }) => {
    const { errorName: errorNameOrEmail, errorPassword } = formErrors;

    const [nameOrEmail, setNameOrEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        clearFormErrors();
    }, [clearFormErrors]);

    const handleLogin = async (e) => {
        e.preventDefault();

        login({ nameOrEmail, password }, closeModal);
    }

    return (
        <form className="wrapLogin" onSubmit={handleLogin} autoComplete="off">
            <TextField
                style={{ width: '254px' }}
                onChange={(e) => setNameOrEmail(e.target.value.trim())}
                error={errorNameOrEmail}
                className="field"
                label="Name or Email"
                variant="outlined"
            />
            <FormControl variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                <OutlinedInput
                    id="outlined-adornment-password"
                    type={showPassword ? 'text' : 'password'}
                    error={errorPassword}
                    onChange={(e) => setPassword(e.target.value.trim())}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={() => setShowPassword(!showPassword)}
                                onMouseDown={() => setShowPassword(!showPassword)}
                                edge="end"
                            >
                                {showPassword ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                        </InputAdornment>
                    }
                    labelWidth={70}
                />
            </FormControl>
            <div className="btnWrap">
                <Button 
                    variant="contained" 
                    color="primary"
                    size="large"
                    disabled={loading}
                    type="submit"
                >
                    Login
                </Button>
                {loading && <CircularProgress size={24} className="progress" />}
            </div>
        </form>
    )
}

const mapStateToProps = (state) => ({
    loading: readIsLoading(state),
    formErrors: readFormErrors(state)
});

const mapDispatchToProps = (dispatch) => ({
    login: (payload, callback) => dispatch(login(payload, callback)),
    clearFormErrors: () => dispatch(clearFormErrors()),
    closeModal: () => dispatch(closeModal()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
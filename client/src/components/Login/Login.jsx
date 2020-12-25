import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useSnackbar } from 'notistack';
import { connect } from 'react-redux';
import { readIsLoading } from '../../reducers/roomReducer';
import { login } from '../../actions/userActions';
import { Button } from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import IconButton from '@material-ui/core/IconButton';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import './login.scss';

const Login = ({ loading, login, onClose }) => {
    const { enqueueSnackbar } = useSnackbar();

    const [nameOrEmail, setNameOrEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errorNameOrEmail, setErrorNameOrEmail] = useState(false);
    const [errorPassword, setErrorPassword] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorPassword(!password);
        setErrorNameOrEmail(!nameOrEmail);
        if (!password || !nameOrEmail) {
            return enqueueSnackbar('Fields cannot be empty.', { variant: 'error' });
        }

        const res = await login({ nameOrEmail, password });
        console.log(res)
        setErrorPassword(res.passwordError);
        setErrorNameOrEmail(res.nameOrEmailError);
        if (res.error || res.passwordError || res.nameOrEmailError) {
            enqueueSnackbar(res.msg, { variant: 'error' });
        }
        else {
            enqueueSnackbar(res.msg, { variant: 'success' });
            onClose();
        }
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
    loading: readIsLoading(state)
});

const mapDispatchToProps = (dispatch) => ({
    login: (payload) => dispatch(login(payload))
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useSnackbar } from 'notistack';
import { connect } from 'react-redux';
import { readIsLoading } from '../../reducers/roomReducer';
import { login } from '../../actions/userActions';
import { Button } from '@material-ui/core';
import './login.scss';

const Login = ({ loading, login, onClose }) => {
    const { enqueueSnackbar } = useSnackbar();

    const [nameOrEmail, setNameOrEmail] = useState('');
    const [password, setPassword] = useState('');
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
                onChange={(e) => setNameOrEmail(e.target.value.trim())}
                error={errorNameOrEmail}
                className="field"
                label="Name"
                variant="outlined"
            />
            <TextField 
                onChange={(e) => setPassword(e.target.value.trim())}
                className="field"
                label="Password"
                variant="outlined"
                type="password"
                error={errorPassword}
            />
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
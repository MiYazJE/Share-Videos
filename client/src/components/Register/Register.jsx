import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Button } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import { connect } from 'react-redux';
import { readIsLoading } from '../../reducers/userReducer';
import { register } from '../../actions/userActions';
import './register.scss';

const Register = ({ loading, register, onClose }) => {
    const { enqueueSnackbar } = useSnackbar();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorName, setErrorName] = useState(false);
    const [errorEmail, setErrorEmail] = useState(false);
    const [errorPassword, setErrorPassword] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setErrorName(!name);
        setErrorEmail(!email);
        setErrorPassword(!password);
        if (!name || !email || !password) {
            return enqueueSnackbar('Fields cannot be empty.', { variant: 'error' });
        }

        const { error, msg, emailError, nameError } = await register({ name, email, password });
        enqueueSnackbar(msg, { variant: `${error ? 'error' : 'success'}` });
        setErrorEmail(emailError);
        setErrorName(nameError);
        if (!error) onClose();
    }

    return (
        <form className="wrapRegister" onSubmit={handleRegister} noValidate autoComplete="nope">
            <TextField
                onChange={(e) => setName(e.target.value.trim())}
                error={errorName} 
                className="field"
                label="Name"
                variant="outlined"
            />
            <TextField 
                onChange={(e) => setEmail(e.target.value.trim())}
                error={errorEmail}
                className="field"
                label="Email"
                variant="outlined"
            />
            <TextField 
                onChange={(e) => setPassword(e.target.value.trim())}
                className="field"
                type="password"
                label="Password"
                variant="outlined"
                error={errorPassword}
            />
            <div className="btnWrap">
                <Button 
                    variant="contained" 
                    color="primary"
                    size="large"
                    type="submit"
                    disabled={loading}
                >
                    Register
                </Button>
                {loading && <CircularProgress size={24} className="progress" />}
            </div>
        </form>
    )
}

const mapStateToProps = (state) => ({
    isLoading: readIsLoading(state)
});

const mapDispatchToProps = (dispatch) => ({
    register: (payload) => dispatch(register(payload))
});

export default connect(mapStateToProps, mapDispatchToProps)(Register);
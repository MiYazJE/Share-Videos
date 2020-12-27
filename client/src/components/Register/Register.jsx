import React, { useEffect, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Button } from '@material-ui/core';
import { connect } from 'react-redux';
import { readIsLoading, readFormErrors } from '../../reducers/userReducer';
import { register, clearFormErrors } from '../../actions/userActions';
import { closeModal } from '../../actions/modalActions';
import './register.scss';

const Register = ({ loading, register, closeModal, formErrors, clearFormErrors }) => {
    const { errorName, errorEmail, errorPassword } = formErrors;

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        clearFormErrors();
    }, [clearFormErrors]);

    const handleRegister = async (e) => {
        e.preventDefault();
        register({ name, email, password }, closeModal);
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
    loading: readIsLoading(state),
    formErrors: readFormErrors(state),
});

const mapDispatchToProps = (dispatch) => ({
    register: (payload, callback) => dispatch(register(payload, callback)),
    clearFormErrors: () => dispatch(clearFormErrors()),
    closeModal: () => dispatch(closeModal()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Register);
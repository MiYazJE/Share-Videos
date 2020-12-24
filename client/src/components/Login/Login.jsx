import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import { connect } from 'react-redux';
import { readIsLoading } from '../../reducers/roomReducer';
import { Button } from '@material-ui/core';
import './login.scss';

const Login = ({ loading }) => {
    const [nameOrEmail, setNameOrEmail] = useState('');
    const [errorNameOrEmail, setErrorNameOrEmail] = useState(false);
    const [errorPassword, setErrorPassword] = useState(false);

    return (
        <form className="wrapLogin" autoComplete="off">
            <TextField
                error={errorNameOrEmail}
                className="field"
                label="Name"
                variant="outlined"
            />
            <TextField 
                className="field"
                label="Password"
                variant="outlined"
            />
            <div className="btnWrap">
                <Button 
                    variant="contained" 
                    color="primary"
                    size="large"
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
    loading: readIsLoading(state)
});

const mapDispatchToProps = () => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
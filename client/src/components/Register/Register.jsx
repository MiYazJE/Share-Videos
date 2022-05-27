import { useState } from 'react';
import { useDispatch } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Button } from '@material-ui/core';

import './register.scss';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();

  const handleRegister = async (e) => {
    e.preventDefault();
    dispatch.user.register({
      name,
      email,
      password,
    });
  };

  return (
    <form className="wrapRegister" onSubmit={handleRegister} noValidate autoComplete="nope">
      <TextField
        onChange={(e) => setName(e.target.value.trim())}
        // error={errorName}
        className="field"
        label="Name"
        variant="outlined"
      />
      <TextField
        onChange={(e) => setEmail(e.target.value.trim())}
        // error={errorEmail}
        className="field"
        label="Email"
        variant="outlined"
      />
      <TextField
        onChange={(e) => setPassword(e.target.value.trim())}
        // error={errorPassword}
        className="field"
        type="password"
        label="Password"
        variant="outlined"
      />
      <div className="btnWrap">
        <Button
          variant="contained"
          color="primary"
          size="large"
          type="submit"
          // disabled={loading}
        >
          Register
        </Button>
        {/* {loading && <CircularProgress size={24} className="progress" />} */}
      </div>
    </form>
  );
}

export default Register;

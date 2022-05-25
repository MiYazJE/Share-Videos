import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { connect, useDispatch } from 'react-redux';

import Routes from './routes/Routes';

import 'react-toastify/dist/ReactToastify.css';
import './app.scss';

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch.user.whoAmI();
  }, [dispatch]);

  return (
    <Router>
      <Routes />
    </Router>
  );
}

export default App;

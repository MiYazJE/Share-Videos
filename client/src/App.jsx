import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { connect } from 'react-redux';

import Routes from './routes/Routes';
import { whoAmI as whoAmIFn } from './actions/userActions';

import 'react-toastify/dist/ReactToastify.css';
import './app.scss';

function App({ whoAmI }) {
  useEffect(() => {
    whoAmIFn();
  }, [whoAmI]);

  return (
    <Router>
      <Routes />
    </Router>
  );
}

const mapDispatchToProps = (dispatch) => ({
  whoAmI: () => dispatch(whoAmIFn()),
});

export default connect(null, mapDispatchToProps)(App);

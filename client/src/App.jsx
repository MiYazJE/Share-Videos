import React, { useEffect } from 'react';
import Routes from './routes/Routes';
import { BrowserRouter as Router } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css';
import { connect } from 'react-redux';
import { whoAmI } from './actions/userActions';
import './app.scss';

const App = ({ whoAmI }) => {

    useEffect(() => {
        whoAmI();
    }, [whoAmI]);

    return (
        <Router>    
            <Routes />
        </Router>
    );
};

const mapDispatchToProps = (dispatch) => ({
    whoAmI: () => dispatch(whoAmI()),
});

export default connect(null, mapDispatchToProps)(App);

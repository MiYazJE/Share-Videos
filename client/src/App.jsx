import React from 'react';
import Routes from './routes/Routes';
import { BrowserRouter as Router } from 'react-router-dom'
import './app.scss';
import 'react-toastify/dist/ReactToastify.css';

const App = () => (
    <Router>    
        <Routes />
    </Router>
);

export default App;

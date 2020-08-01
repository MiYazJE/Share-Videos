import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from './reducers';

const composeFunction = process.env.REACT_APP_ENVIROMENT === 'PRODUCTION'
    ? compose
    : composeWithDevTools;

const store = createStore(rootReducer, {}, composeFunction(applyMiddleware(thunk)));

export default store;

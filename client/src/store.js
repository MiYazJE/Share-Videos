// import { createStore, applyMiddleware, compose } from 'redux';
// import thunk from 'redux-thunk';
// import { composeWithDevTools } from 'redux-devtools-extension';
// import rootReducer from './reducers';

// const composeFunction = process.env.NODE_ENV === 'development'
//   ? composeWithDevTools
//   : compose;

// const store = createStore(rootReducer, composeFunction(applyMiddleware(thunk, )));

import { init } from '@rematch/core';
import createLoadingPlugin from '@rematch/loading';
import * as models from 'src/models';
import socketMiddleware from './middlewares/socketMiddleware';

const loading = createLoadingPlugin({});
const middlewares = [socketMiddleware()];

const store = init({
  models,
  plugins: [loading],
  redux: {
    reducers: {},
    middlewares,
    devtoolOptions: { disabled: process.env.NODE_ENV === 'production' },
    rootReducers: { RESET_APP: () => undefined },
  },
});

export default store;

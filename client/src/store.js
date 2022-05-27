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

import { init } from '@rematch/core';
import createLoadingPlugin from '@rematch/loading';
import * as models from 'src/models';

const loading = createLoadingPlugin({});

const store = init({
  models,
  plugins: [loading],
  redux: {
    reducers: {},
    devtoolOptions: { disabled: process.env.NODE_ENV === 'production' },
    rootReducers: { RESET_APP: () => undefined },
  },
});

export default store;

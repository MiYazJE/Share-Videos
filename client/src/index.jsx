import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider as ReduxProvider } from 'react-redux';
import { ChakraProvider } from '@chakra-ui/react';

import App from './App';
import store from './store';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <ReduxProvider store={store}>
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </ReduxProvider>
  </React.StrictMode>,
);

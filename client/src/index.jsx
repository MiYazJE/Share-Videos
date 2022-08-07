import { createRoot } from 'react-dom/client';
import { Provider as ReduxProvider } from 'react-redux';
import { ChakraProvider } from '@chakra-ui/react';

import App from './App';
import store from './store';
import SocketEventsProvider from './context/SocketEventsContextProvider';
import theme from './theme';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <ReduxProvider store={store}>
    <ChakraProvider theme={theme}>
      <SocketEventsProvider>
        <App />
      </SocketEventsProvider>
    </ChakraProvider>
  </ReduxProvider>,
);

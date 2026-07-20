import { createRoot } from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import { QueryClientProvider } from '@tanstack/react-query';

import App from './App';
import SocketEventsProvider from './context/SocketEventsContextProvider';
import NotificationProvider from './context/NotificationContextProvider';
import SessionProvider from './context/SessionContextProvider';
import queryClient from './queryClient';
import theme from './theme';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <QueryClientProvider client={queryClient}>
    <ChakraProvider theme={theme}>
      <NotificationProvider>
        <SessionProvider>
          <SocketEventsProvider>
            <App />
          </SocketEventsProvider>
        </SessionProvider>
      </NotificationProvider>
    </ChakraProvider>
  </QueryClientProvider>,
);

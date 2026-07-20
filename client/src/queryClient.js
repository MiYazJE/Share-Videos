import { QueryClient } from '@tanstack/react-query';

export const shouldRetry = (failureCount, error) => (
  failureCount < 2 && (!error.status || error.status >= 500)
);

export const createQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: shouldRetry,
      refetchOnWindowFocus: false,
    },
    mutations: { retry: false },
  },
});

const queryClient = createQueryClient();

export default queryClient;

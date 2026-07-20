import {
  createContext,
  useCallback,
  useContext,
  useMemo,
} from 'react';
import { useToast } from '@chakra-ui/react';

const NotificationContext = createContext(null);

function NotificationProvider({ children }) {
  const toast = useToast({
    isClosable: true,
    position: 'bottom-left',
    duration: 3000,
  });

  const notify = useCallback(({ msg, variant = 'info' }) => {
    toast.closeAll();
    toast({ description: msg, status: variant });
  }, [toast]);

  const value = useMemo(() => ({ notify }), [notify]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotification = () => {
  const value = useContext(NotificationContext);
  if (!value) throw new Error('useNotification must be used inside NotificationProvider');
  return value;
};

export default NotificationProvider;

import { useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import { useSelector } from 'react-redux';

const readNotification = ({ notifier }) => notifier.notification;

function Notifier() {
  const notification = useSelector(readNotification);
  const toast = useToast({
    isClosable: true,
    position: 'bottom-left',
    duration: 2000,
  });

  useEffect(() => {
    if (notification) {
      toast.closeAll();
      toast({
        description: notification.msg,
        status: notification.variant,
      });
    }
  }, [notification, toast]);

  return null;
}

export default Notifier;

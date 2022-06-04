import { useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import { useSelector } from 'react-redux';

const readNotification = ({ notifier }) => notifier.notification;

function Notifier() {
  const notification = useSelector(readNotification);
  const toast = useToast({
    isClosable: true,
    position: 'top',
  });

  useEffect(() => {
    if (notification) {
      toast({
        title: notification.msg,
        status: notification.variant,
      });
    }
  }, [notification, toast]);

  return null;
}

export default Notifier;

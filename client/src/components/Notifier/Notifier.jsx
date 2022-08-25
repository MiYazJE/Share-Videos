import { useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import { useSelector, useDispatch } from 'react-redux';

const readNotification = ({ notifier }) => notifier.notification;

function Notifier() {
  const dispatch = useDispatch();
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
      dispatch.notifier.CLEAR_NOTIFICATION();
    }
  }, [notification, toast, dispatch]);

  return null;
}

export default Notifier;

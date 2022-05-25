import { useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { useSelector } from 'react-redux';

const readNotification = ({ notifier }) => notifier.notification;

function Notifier() {
  const { enqueueSnackbar } = useSnackbar();
  const notification = useSelector(readNotification);

  useEffect(() => {
    if (notification) enqueueSnackbar(notification.msg, { variant: notification.variant });
  }, [notification, enqueueSnackbar]);

  return null;
}

export default Notifier;

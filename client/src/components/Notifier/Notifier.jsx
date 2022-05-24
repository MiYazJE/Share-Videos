import { useEffect } from 'react';
import { connect } from 'react-redux';
import { useSnackbar } from 'notistack';
import { readNotification } from '../../reducers/notifierReducer';

function Notifier({ notification }) {
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (notification) enqueueSnackbar(notification.msg, { variant: notification.variant });
  }, [notification, enqueueSnackbar]);

  return null;
}

const mapStateToProps = (state) => ({
  notification: readNotification(state),
});

export default connect(mapStateToProps, null)(Notifier);

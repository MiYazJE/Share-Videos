import { useEffect } from 'react';
import { connect } from 'react-redux';
import { readNotification } from '../../reducers/notifierReducer';
import { useSnackbar } from 'notistack';

const Notifier = ({ notification }) => {
    const { enqueueSnackbar } = useSnackbar();
 
    useEffect(() => {
        if (notification) enqueueSnackbar(notification.msg, { variant: notification.variant });
    }, [notification, enqueueSnackbar]);

    return null;
};

const mapStateToProps = (state) => ({
    notification: readNotification(state),
});

export default connect(mapStateToProps, null)(Notifier);

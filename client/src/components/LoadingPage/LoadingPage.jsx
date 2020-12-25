import React from 'react';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import './loadingPage.scss';

const LoadingPage = () => {

    console.log('render Loading Page');
    return (
        <div id="wrapLoading">
            <Backdrop open={true}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </div>
    );
};

export default LoadingPage;
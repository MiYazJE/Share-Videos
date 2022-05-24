import React from 'react';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import './loadingPage.scss';

function LoadingPage() {
  console.log('render Loading Page');
  return (
    <div id="wrapLoading">
      <Backdrop open>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}

export default LoadingPage;

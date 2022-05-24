import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import { connect } from 'react-redux';
import Room from '../components/Room';
import Home from '../components/Home';
import { readIsLoadingUser } from '../reducers/userReducer';
import LoadingPage from '../components/LoadingPage';
import Notifier from '../components/Notifier';

function Routes({ loadingUserData }) {
  return (
    <div id="app">
      <SnackbarProvider maxSnack={3}>
        <Notifier />
        {loadingUserData ? <LoadingPage />
          : (
            <Switch>
              <Route path="/" exact>
                <Home />
              </Route>
              <Route path="/room/:id">
                <Room />
              </Route>
              <Route path="*">
                <Home />
              </Route>
            </Switch>
        )}
      </SnackbarProvider>
    </div>
  );
}

const mapStateToProps = (state) => ({
  loadingUserData: readIsLoadingUser(state),
});

export default connect(mapStateToProps, null)(Routes);

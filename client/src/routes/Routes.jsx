import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import { useSelector } from 'react-redux';

import Home from 'src/pages/Home';
import Room from 'src/components/Room';
import LoadingPage from 'src/components/LoadingPage';
import Notifier from 'src/components/Notifier';

const isLoadingUser = ({ user }) => user.loadingUser;

function Routes() {
  const loadingUserData = useSelector(isLoadingUser);
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
              {/* <Route path="/room/:id">
                <Room />
              </Route> */}
              <Route path="*">
                <Home />
              </Route>
            </Switch>
          )}
      </SnackbarProvider>
    </div>
  );
}

export default Routes;

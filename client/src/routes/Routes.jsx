import { Switch, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Home from 'src/pages/Home';
import { Room } from 'src/pages/Room';
import LoadingPage from 'src/components/LoadingPage';
import Notifier from 'src/components/Notifier';

const isLoadingUser = ({ user }) => user.loadingUser;

function Routes() {
  const loadingUserData = useSelector(isLoadingUser);
  return (
    <div id="app">
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
    </div>
  );
}

export default Routes;

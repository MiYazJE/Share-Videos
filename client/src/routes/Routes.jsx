import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Room from '../components/Room';
import Home from '../components/Home';
import { SnackbarProvider } from 'notistack';
import { connect } from 'react-redux';
import { readIsLoading } from '../reducers/userReducer';
import LoadingPage from '../components/LoadingPage';
import Notifier from '../components/Notifier';

const Routes = ({ loadingUserData }) => (
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

const mapStateToProps = (state) => ({
    loadingUserData: readIsLoading(state),
});

export default connect(mapStateToProps, null)(Routes);
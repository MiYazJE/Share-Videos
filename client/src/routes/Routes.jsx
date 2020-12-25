import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Room from '../components/Room';
import Home from '../components/Home';
import { ToastContainer } from 'react-toastify';
import { SnackbarProvider } from 'notistack';
import { connect } from 'react-redux';
import { readIsLoading } from '../reducers/userReducer';
import LoadingPage from '../components/LoadingPage';

const Routes = ({ loadingUserData }) => (
    <div id="app">
        <SnackbarProvider maxSnack={3}>
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
        <ToastContainer closeOnClick />
    </div>
);

const mapStateToProps = (state) => ({
    loadingUserData: readIsLoading(state),
});

export default connect(mapStateToProps, null)(Routes);
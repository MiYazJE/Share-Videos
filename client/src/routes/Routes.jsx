import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Room from '../components/Room';
import Home from '../components/Home';
import { ToastContainer } from 'react-toastify';
import { SnackbarProvider } from 'notistack';

const Routes = () => (
    <div id="app">
        <SnackbarProvider maxSnack={3}>
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
            <ToastContainer closeOnClick />
        </SnackbarProvider>
    </div>
);

export default Routes;
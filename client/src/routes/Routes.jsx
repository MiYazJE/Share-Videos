import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Room from '../components/Room';
import Home from '../components/Home';

const Routes = () => (
    <div id="app">
        <Switch>
            <Route path="/" exact>
                <Home />
            </Route>
            <Route path="/room" exact>
                <Room />
            </Route>
        </Switch>
    </div>
);

export default Routes;
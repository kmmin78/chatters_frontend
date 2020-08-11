import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
} from 'react-router-dom';
import { Login } from './components/pages';

function App<T>(props: T) {
    return (
        <>
            <Router>
                <Switch>
                    <Route exact path={['/']} component={Login}></Route>
                    <Redirect path='*' to='/' />
                </Switch>
            </Router>
        </>
    );
}

export default App;

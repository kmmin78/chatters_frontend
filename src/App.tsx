import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
} from 'react-router-dom';
import { Login, Profile } from 'components/pages';

function App<T>(props: T) {
    return (
        <>
            <Router>
                <Switch>
                    <Route exact path={['/']} component={Login}></Route>
                    <Route path='/profile' component={Profile} />
                    <Redirect path='*' to='/' />
                </Switch>
            </Router>
        </>
    );
}

export default App;

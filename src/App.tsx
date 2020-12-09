import React from 'react';
import { BrowserRouter as Router, Switch, Redirect } from 'react-router-dom';
import { Login, Profile } from 'components/pages';
import { CommonRoute as Route } from 'components/parts/common';

function App<T>(props: T) {
    return (
        <>
            <Router>
                <Switch>
                    <Route
                        exact
                        path={['/']}
                        component={Login}
                        name='Login'
                    ></Route>
                    <Route path='/profile' component={Profile} name='Profile' />
                    <Redirect path='*' to='/' />
                </Switch>
            </Router>
        </>
    );
}

export default App;

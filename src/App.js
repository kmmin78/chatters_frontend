import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Login } from 'components/pages';

function App(props) {
    return (
        <>
            <Router>
                <Switch>
                    <Route exact path={['/']} component={Login}></Route>
                </Switch>
            </Router>
        </>
    );
}

export default App;

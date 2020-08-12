import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import * as Constants from 'constants/constants';
import authHeader from 'auth/authHeader';
import axios from 'axios';

//axios default 세팅
const authorization = authHeader().Authorization;
axios.defaults.baseURL = Constants.API_URL;
axios.defaults.headers.common['Authorization'] = authorization;

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

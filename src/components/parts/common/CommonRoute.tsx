import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import AuthService from 'auth/authService';

export default function CommonRouteTypes({
    component: Component,
    ...rest
}: {
    component: any;
    exact?: any;
    path: any;
}) {
    const currentUser = AuthService.getCurrentUser();

    return (
        <>
            <Route
                {...rest}
                render={(props) => {
                    if (
                        !currentUser.accessToken &&
                        Component.name !== 'Login'
                    ) {
                        // not logged in so redirect to login page with the return url
                        return (
                            <Redirect
                                to={{
                                    pathname: '/',
                                    state: { from: props.location },
                                }}
                            />
                        );
                    }
                    if (currentUser.accessToken && Component.name === 'Login') {
                        return (
                            <Redirect
                                to={{
                                    pathname: '/profile',
                                    state: { from: props.location },
                                }}
                            />
                        );
                    }
                    // authorized so return component
                    return (
                        <>
                            <Component {...props} {...rest} />
                        </>
                    );
                }}
            />
        </>
    );
}

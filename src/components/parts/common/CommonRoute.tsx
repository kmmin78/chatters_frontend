import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import AuthService from 'auth/authService';

interface CommonRoute extends RouteProps {
    component: any;
    name: string;
    pageName?: string;
}

const CommonRoute: React.FC<CommonRoute> = ({
    component: Component,
    name,
    ...rest
}) => {
    const currentUser = AuthService.getCurrentUser();

    return (
        <>
            <Route
                {...rest}
                render={(props) => {
                    if (!currentUser.accessToken && name !== 'Login') {
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
                    if (currentUser.accessToken && name === 'Login') {
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
};

export default React.memo(CommonRoute);

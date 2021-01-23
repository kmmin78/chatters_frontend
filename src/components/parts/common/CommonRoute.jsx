import React, { useRef, useState } from 'react';
import { Route, Redirect } from 'react-router-dom';
import AuthService from 'auth/authService';
import AuthHeader from 'auth/authHeader';
import SockJsClient from 'react-stomp';
import { API_URL } from 'constants/constants';

const CommonRoute = ({ component: Component, name, ...rest }) => {
    const currentUser = AuthService.getCurrentUser();

    const header = {
        username: currentUser.username,
        memberName: currentUser.memberName,
        ...AuthHeader(),
    };

    const [webSocket, setWebSocket] = useState();

    const onSendMessage = (inputMessage, type) => {
        // SendMessage(webSocket, inputMessage, type, '/topic/send', roomId);
    };

    const onMessageReceive = (receive) => {};

    const onDisconnect = () => {
        webSocket.disconnect();
    };
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
                            {name === 'Login' ? null : (
                                <SockJsClient
                                    url={`${API_URL}/ccu`}
                                    topics={[`/topic/ccu`]}
                                    headers={header}
                                    subscribeHeaders={header}
                                    onMessage={onMessageReceive}
                                    ref={(client) => setWebSocket(client)}
                                    onConnect={() => {}}
                                    onDisconnect={() => {}}
                                    onConnectFailure={(res) => {
                                        console.log(res);
                                    }}
                                    debug={false}
                                    style={[{ width: '100%', height: '100%' }]}
                                />
                            )}
                        </>
                    );
                }}
            />
        </>
    );
};

export default React.memo(CommonRoute);

// import React from 'react';
// import { Route, Redirect, RouteProps } from 'react-router-dom';
// import AuthService from 'auth/authService';

// interface CommonRoute extends RouteProps {
//     component: any;
//     name: string;
//     pageName?: string;
// }

// const CommonRoute: React.FC<CommonRoute> = ({
//     component: Component,
//     name,
//     ...rest
// }) => {
//     const currentUser = AuthService.getCurrentUser();

//     return (
//         <>
//             <Route
//                 {...rest}
//                 render={(props) => {
//                     if (!currentUser.accessToken && name !== 'Login') {
//                         // not logged in so redirect to login page with the return url
//                         return (
//                             <Redirect
//                                 to={{
//                                     pathname: '/',
//                                     state: { from: props.location },
//                                 }}
//                             />
//                         );
//                     }
//                     if (currentUser.accessToken && name === 'Login') {
//                         return (
//                             <Redirect
//                                 to={{
//                                     pathname: '/profile',
//                                     state: { from: props.location },
//                                 }}
//                             />
//                         );
//                     }
//                     // authorized so return component
//                     return (
//                         <>
//                             <Component {...props} {...rest} />
//                         </>
//                     );
//                 }}
//             />
//         </>
//     );
// };

// export default React.memo(CommonRoute);

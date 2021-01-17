import React, { useRef, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, Button, Typography } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Avatar from '@material-ui/core/Avatar';
import SockJsClient from 'react-stomp';
import { API_URL } from 'constants/constants';
import AuthService from 'auth/authService';
import moment from 'moment';
import { SendMessage } from './utils/common';
import AuthHeader from 'auth/authHeader';
import qs from 'query-string';
import './css/styles.css';

const MessageType = {
    ENTER: 'ENTER',
    EXIT: 'EXIT',
    MESSAGE: 'MESSAGE',
};

//material-ui
const useStyles = makeStyles((theme) => ({
    // container: {
    //     position: 'fixed',
    //     top: '10vh',
    //     left: '15vw',
    //     height: '80vh',
    //     width: '70vw',
    //     display: 'flex',
    //     flexDirection: 'column',
    //     // position: "fixed" // remove this so we can apply flex design
    // },
    container: {
        height: '97vh',
        width: '98vw',
    },
    bubbleContainer: {
        width: '100%',
        display: 'flex', //new added flex so we can put div at left and right side
        //check style.css for left and right classnaeme based on your data
        backgroundColor: '#F6F6F6',
    },
    bubble: {
        borderRadius: '10px',
        margin: '5px',
        padding: '10px',
        display: 'inline-block',
    },
    // header: {
    //     borderTopLeftRadius: '5px',
    //     borderTopRightRadius: '5px',
    //     boxSizing: 'border-box',
    //     height: '6vh',
    //     lineHeight: '6vh',
    //     width: '100%',
    //     backgroundColor: '#3f51b5',
    //     textAlign: 'center',
    //     color: 'white',
    //     fontSize: '1.5rem',
    // },
    header: {
        height: '10vh',
        lineHeight: '10vh',
    },
    body: {
        // border: '1.5px solid #D5D5D5',
        boxSizing: 'border-box',
        width: '98vw',
        height: '78vh',
        backgroundColor: '#F6F6F6',
        overflow: 'auto',
    },
    footer: {
        height: '10vh',
        width: '98vw',
    },
    input: {
        width: '60%',
        height: '35px',
        borderBottomLeftRadius: '5px',
        boxSizing: 'border-box',
        border: '1.5px solid #D5D5D5',
    },
    button: { width: '40%' },
    name: {
        fontSize: '0.7rem',
        position: 'relative',
        left: '3px',
    },
    message: {
        fontSize: '0.8rem',
    },
    time: {
        display: 'inline-block',
        position: 'relative',
        top: '20px',
        fontSize: '0.7rem',
    },
    system: {
        margin: '1.5vh',
        fontWeight: 'bold',
    },
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
    innerBlockLeft: {
        width: '40px',
        marginLeft: '10px',
    },
    innerBlockRight: {
        display: 'flex',
        flexDirection: 'column',
        marginRight: '10px',
    },
    rightTop: {},
}));

const ChatWindow = (props) => {
    const classes = useStyles();
    const { roomId } = qs.parse(props.location.search);
    const { username, memberName } = AuthService.getCurrentUser();
    const header = {
        // roomId,
        username,
        memberName,
        ...AuthHeader(),
    };

    const [connectState, setConnectState] = useState(false);
    const [message, setMessage] = useState([]);
    const [userCount, setUserCount] = useState(0);
    const [webSocket, setWebSocket] = useState();
    const inputRef = useRef();
    const chatBodyRef = useRef();

    const chatBubbles = message.map((obj, i) => {
        const time = moment(obj.sendDate).format('hh:mm');
        let nextTime, nextUser;
        if (message[i + 1]) {
            nextTime = moment(message[i + 1].sendDate).format('hh:mm');
            nextUser = message[i + 1].user;
        }
        let prevUser, prevType;
        if (message[i - 1]) {
            prevUser = message[i - 1].user;
            prevType = message[i - 1].type;
        }

        return obj.type === 'MESSAGE' ? (
            <div
                className={`${classes.bubbleContainer} ${obj.direction}`}
                key={i}
            >
                {obj.direction === 'left' ? (
                    <div className={`${obj.direction}-block`}>
                        <div className={classes.innerBlockLeft}>
                            {obj.user !== prevUser || obj.type !== prevType ? (
                                <Avatar src='/broken-image.jpg' />
                            ) : null}
                        </div>
                        <div className={classes.innerBlockRight}>
                            <div className={classes.rightTop}>
                                {obj.user !== prevUser ? (
                                    <div className={classes.name}>
                                        {obj.name}
                                    </div>
                                ) : null}
                            </div>
                            <div className={classes.rightBot}>
                                <div
                                    key={i++}
                                    className={`${classes.bubble} ${obj.direction}-bubble`}
                                >
                                    <div className={classes.message}>
                                        {obj.message}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {time !== nextTime || obj.user !== nextUser ? (
                            <div>
                                <span className={classes.time}>{time}</span>
                            </div>
                        ) : null}
                    </div>
                ) : (
                    <div className={`${obj.direction}-block`}>
                        {time !== nextTime || obj.user !== nextUser ? (
                            <div>
                                <span className={classes.time}>{time}</span>
                            </div>
                        ) : null}
                        <div
                            key={i++}
                            className={`${classes.bubble} ${obj.direction}-bubble`}
                        >
                            <div className={classes.message}>{obj.message}</div>
                        </div>
                    </div>
                )}
            </div>
        ) : (
            <div key={i++} className={classes.system}>
                {obj.message}
            </div>
        );
    });

    const onKeyPress = (event) => {
        if (event.key === 'Enter')
            onSendMessage(inputRef.current.value, MessageType.MESSAGE);
    };

    const onSendMessage = (inputMessage, type) => {
        SendMessage(webSocket, inputMessage, type, '/topic/send', roomId);
        inputRef.current.value = '';
    };

    const onMessageReceive = (receive) => {
        // console.dir(receive);
        //메세지
        setMessage((message) => [
            ...message,
            {
                user: receive.username,
                name: receive.memberName,
                type: receive.type,
                message: receive.message,
                sendDate: receive.sendDate,
                direction:
                    AuthService.getCurrentUser().username === receive.username
                        ? 'right'
                        : 'left',
            },
        ]);
        //접속인원
        setUserCount(receive.userCount);
        chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    };

    const onDisconnect = () => {
        webSocket.disconnect();
    };

    return (
        <>
            {/* <div className={classes.container}>
                <div className={classes.header}>
                    Chat Room 현재 접속 인원 : {userCount}명
                </div>
            </div> */}
            <div className={classes.container}>
                <AppBar position='static' className={classes.header}>
                    <Toolbar>
                        <IconButton
                            edge='start'
                            className={classes.menuButton}
                            color='inherit'
                            aria-label='menu'
                            onClick={onDisconnect}
                        >
                            <ArrowBackIcon />
                        </IconButton>
                        <Typography variant='h6' className={classes.title}>
                            Chat Room ({userCount}명)
                        </Typography>
                        {/* <Typography variant='h6' className={classes.title}>
                        News
                    </Typography> */}
                        {/* <Button color='inherit'>Login</Button> */}
                    </Toolbar>
                </AppBar>

                <div className={classes.body} ref={chatBodyRef}>
                    {chatBubbles}
                </div>
                <div className={classes.footer}>
                    <input
                        type='text'
                        className={classes.input}
                        onKeyPress={onKeyPress}
                        ref={inputRef}
                    ></input>
                    <Button
                        className={classes.button}
                        variant='contained'
                        color='primary'
                        onClick={() => {
                            onSendMessage(
                                inputRef.current.value,
                                MessageType.MESSAGE
                            );
                        }}
                    >
                        Send
                    </Button>
                </div>
            </div>

            <SockJsClient
                url={`${API_URL}/chatting`}
                topics={[`/topic/${roomId}`]}
                headers={header}
                subscribeHeaders={header}
                onMessage={onMessageReceive}
                ref={(client) => setWebSocket(client)}
                onConnect={() => {
                    setConnectState(true);
                    //https://github.com/lahsivjar/react-stomp/blob/master/API.md 참조
                }}
                onDisconnect={() => {
                    setConnectState(false);
                    // alert('웹소켓 연결이 해제되었습니다.\n다시 접속해주세요.');
                    props.history.push('/');
                }}
                onConnectFailure={(res) => {
                    console.log(res);
                    alert('웹소켓 연결에 실패하였습니다.\n다시 접속해주세요.');
                    props.history.push('/');
                }}
                debug={false}
                style={[{ width: '100%', height: '100%' }]}
            />
        </>
    );
};

export default ChatWindow;

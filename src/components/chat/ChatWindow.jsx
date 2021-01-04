import React, { useRef, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import SockJsClient from 'react-stomp';
import { API_URL } from 'constants/constants';
import AuthService from 'auth/authService';
import moment from 'moment';
import { SendMessage } from './utils/common';
import AuthHeader from 'auth/authHeader';
import './css/styles.css';

const MessageType = {
    ENTER: 'ENTER',
    EXIT: 'EXIT',
    MESSAGE: 'MESSAGE',
};

//material-ui
const useStyles = makeStyles((theme) => ({
    container: {
        position: 'fixed',
        top: '10vh',
        left: '15vw',
        height: '80vh',
        width: '70vw',
        display: 'flex',
        flexDirection: 'column',
        // position: "fixed" // remove this so we can apply flex design
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
    header: {
        borderTopLeftRadius: '5px',
        borderTopRightRadius: '5px',
        boxSizing: 'border-box',
        height: '6vh',
        lineHeight: '6vh',
        width: '100%',
        backgroundColor: '#3f51b5',
        textAlign: 'center',
        color: 'white',
        fontSize: '1.5rem',
    },
    body: {
        border: '1.5px solid #D5D5D5',
        boxSizing: 'border-box',
        width: '100%',
        height: '80%',
        backgroundColor: '#F6F6F6',
        overflow: 'auto',
    },
    footer: {
        width: '100%',
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
        lineHeight: '50px',
        margin: '0 3px 0 10px',
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
}));

const ChatWindow = (props) => {
    const classes = useStyles();

    const [connectState, setConnectState] = useState(false);
    const [message, setMessage] = useState([]);
    const [webSocket, setWebSocket] = useState();
    const inputRef = useRef();
    const chatBodyRef = useRef();

    const chatBubbles = message.map((obj, i) => {
        const time = moment(obj.sendDate).format('hh:mm');
        let nextTime;
        if (message[i + 1]) {
            nextTime = moment(message[i + 1].sendDate).format('hh:mm');
        }
        return obj.type === 'MESSAGE' ? (
            <div
                className={`${classes.bubbleContainer} ${obj.direction}`}
                key={i}
            >
                {obj.direction === 'left' ? (
                    <div className={classes.name}>{obj.name}</div>
                ) : null}
                {obj.direction === 'right' && time !== nextTime ? (
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
                {obj.direction === 'left' && time !== nextTime ? (
                    <div>
                        <span className={classes.time}>{time}</span>
                    </div>
                ) : null}
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
        SendMessage(webSocket, inputMessage, type, '/group/all/send');
        inputRef.current.value = '';
    };

    const onMessageReceive = (receive) => {
        // console.dir(receive);
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

        chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    };

    const onDisconnect = () => {
        // onSendMessage('퇴장', MessageType.EXIT);
        SendMessage(webSocket, '퇴장', MessageType.EXIT, '/group/all/exit');
        webSocket.disconnect();
        props.history.push('/');
    };

    return (
        <>
            <div className={classes.container}>
                <div className={classes.header}>Chat</div>
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
                    {/* <Button onClick={onDisconnect}>연결끊기</Button> */}
                </div>
            </div>

            <SockJsClient
                url={`${API_URL}/chatters`}
                topics={[`/topic/all`]}
                headers={AuthHeader()}
                subscribeHeaders={AuthHeader()}
                onMessage={onMessageReceive}
                ref={(client) => setWebSocket(client)}
                onConnect={() => {
                    setConnectState(true);
                    //https://github.com/lahsivjar/react-stomp/blob/master/API.md 참조
                    // onSendMessage('입장', MessageType.ENTER);
                    SendMessage(
                        webSocket,
                        '입장',
                        MessageType.ENTER,
                        '/group/all/enter'
                    );
                }}
                onDisconnect={() => {
                    setConnectState(false);
                }}
                onConnectFailure={(res) => {
                    alert('웹소켓 연결에 실패하였습니다.');
                    console.log(res);
                }}
                debug={false}
                style={[{ width: '100%', height: '100%' }]}
            />
        </>
    );
};

export default ChatWindow;

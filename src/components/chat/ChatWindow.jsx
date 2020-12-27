import React, { useRef, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import SockJsClient from 'react-stomp';
import { API_URL } from 'constants/constants';
import AuthService from 'auth/authService';
import moment from 'moment';
import './css/styles.css';

const messageType = {
    ENTER : 'ENTER',
    MESSAGE : 'MESSAGE',
}

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
        overflow : 'auto',
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
    message: {
        fontSize: '0.8rem',
    },
}));

const ChatWindow = () => {
    const classes = useStyles();

    const [connectState, setConnectState] = useState(false);
    const [message, setMessage] = useState([]);
    const inputRef = useRef();
    const chatBodyRef = useRef();

    const chatBubbles = message.map((obj, i) => (
        <div className={`${classes.bubbleContainer} ${obj.direction}`} key={i}>
            <div
                key={i++}
                className={`${classes.bubble} ${obj.direction}-bubble`}
            >
                <div className={classes.message}>{obj.message}</div>
            </div>
        </div>
    ));

    let webSocket;

    const onKeyPress = (event) => {
        if(event.key === 'Enter') onSendMessage(inputRef.current.value, messageType.MESSAGE);
    }

    const onSendMessage = (inputMessage, type) => {
        if(inputMessage){   
            const message = {
                user : AuthService.getCurrentUser().username,
                type,
                message : inputMessage,
                sendDate : moment().format('YYYY-MM-DD HH:mm:ss')
            }
            webSocket.sendMessage('/group/sendToAll', JSON.stringify(message));
            inputRef.current.value = '';
        }
    };

    const onMessageReceive = (receive) => {
        console.dir(receive);
        setMessage((message) => [
            ...message,
            {
                user : receive.user,
                type : receive.type,
                message : receive.message,
                sendDate : receive.sendDate,
                direction : AuthService.getCurrentUser().username === receive.user ? 'left' : 'right'
            }
        ]);

        chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    };

    return (
        <>
            <div className={classes.container}>
                <div className={classes.header}>Chat</div>
                <div className={classes.body} ref={chatBodyRef}>{chatBubbles}</div>
                <div className={classes.footer}>
                    <input type='text' className={classes.input} onKeyPress={onKeyPress} ref={inputRef}></input>
                    <Button
                        className={classes.button}
                        variant='contained'
                        color='primary'
                        onClick={()=>{onSendMessage(inputRef.current.value, messageType.MESSAGE)}}
                    >
                        Send
                    </Button>
                </div>
            </div>

            <SockJsClient
                url={`${API_URL}/chatters`}
                topics={[`/topic/all`]}
                onMessage={onMessageReceive}
                ref={(client) =>
                    (webSocket = client)
                }
                onConnect={() => {
                    setConnectState(true);
                    //입장 구현 필요.. https://github.com/lahsivjar/react-stomp/blob/master/API.md 참조
                    // onSendMessage('입장', messageType.ENTER);
                }}
                onDisconnect={() => {
                    setConnectState(false);
                }}
                debug={false}
                style={[{ width: '100%', height: '100%' }]}
            />
        </>
    );
};

export default ChatWindow;

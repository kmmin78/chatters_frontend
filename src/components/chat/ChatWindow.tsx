import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import './css/styles.css';

//material-ui
const useStyles = makeStyles((theme) => ({
    container: {
        position: 'fixed',
        top: '10vh',
        left: '25vw',
        height: '80vh',
        width: '50vw',
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

    const dummyData = [
        {
            message: '1: This should be in left',
            direction: 'left',
        },
        {
            message: '2: This should be in right',
            direction: 'right',
        },
        {
            message: '3: This should be in left again',
            direction: 'left',
        },
        {
            message: '4: This should be in right again',
            direction: 'right',
        },
    ];
    const chatBubbles = dummyData.map((obj, i) => (
        <div className={`${classes.bubbleContainer} ${obj.direction}`} key={i}>
            <div
                key={i++}
                className={`${classes.bubble} ${obj.direction}-bubble`}
            >
                <div className={classes.message}>{obj.message}</div>
            </div>
        </div>
    ));

    return (
        <>
            <div className={classes.container}>
                <div className={classes.header}>Chat</div>
                <div className={classes.body}>{chatBubbles}</div>
                <div className={classes.footer}>
                    <input type='text' className={classes.input}></input>
                    <Button
                        className={classes.button}
                        variant='contained'
                        color='primary'
                    >
                        Send
                    </Button>
                </div>
            </div>
        </>
    );
};

export default ChatWindow;

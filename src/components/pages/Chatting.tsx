import React from 'react';
// import { makeStyles } from '@material-ui/core/styles';
import { RouteComponentProps } from 'react-router-dom';
import { ChatWindow } from 'components/chat';
// import axios from 'axios';
// import axios from 'utils/axios.modules';

//material-ui
// const useStyles = makeStyles((theme) => ({
//     container: {
//         bottom: 0,
//         // position: "fixed" // remove this so we can apply flex design
//     },
//     bubbleContainer: {
//         width: '100%',
//         display: 'flex', //new added flex so we can put div at left and right side
//         //check style.css for left and right classnaeme based on your data
//     },
//     bubble: {
//         border: '0.5px solid black',
//         borderRadius: '10px',
//         margin: '5px',
//         padding: '10px',
//         display: 'inline-block',
//     },
//     button: {},
// }));

export default function Chatting(props: RouteComponentProps) {
    return (
        <>
            <ChatWindow />
        </>
    );
}

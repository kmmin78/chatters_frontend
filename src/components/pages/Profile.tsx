import React from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import AuthService from 'auth/authService';
// import axios from 'axios';
import { RouteComponentProps } from 'react-router-dom';
import axios from 'utils/axios.modules';

//material-ui
const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(18),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(5),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

export default function Profile(props: RouteComponentProps) {
    const classes = useStyles();

    function logOutProcess() {
        AuthService.logout(null);
    }

    // const currentUser = AuthService.getCurrentUser();

    function testAjax() {
        axios
            .get('/test')
            .then((data) => {
                const { username, role } = data?.data;
                alert(
                    `아이디 : ${username}\n권한 : ${role.map(
                        (role: any) => role.authority
                    )}`
                );
                console.dir(data);
            })
            .catch((error) => {
                console.dir(error);
            });
    }

    const goChattingPage = () => {
        const roomId = 'all';
        props.history.push(`./chatting?roomId=${roomId}`);
    };

    return (
        <>
            {/* <div>로그인 성공!</div>
            <div>환영합니다, {currentUser.memberName}님!</div>
            <div>TOKEN : {currentUser.accessToken}</div> */}
            <Button
                onClick={testAjax}
                fullWidth
                variant='contained'
                color='secondary'
                className={classes.submit}
            >
                api 테스트
            </Button>
            <Button
                onClick={goChattingPage}
                fullWidth
                variant='contained'
                color='secondary'
                className={classes.submit}
            >
                채팅하기
            </Button>
            <Button
                onClick={logOutProcess}
                fullWidth
                variant='contained'
                color='primary'
                className={classes.submit}
            >
                로그아웃
            </Button>
        </>
    );
}

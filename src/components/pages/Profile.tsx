import React from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import AuthService from 'auth/authService';
import axios from 'axios';
import { RouteComponentProps } from 'react-router-dom';
// import axios from 'utils/axios.modules';

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
        AuthService.logout(props);
    }

    const currentUser = AuthService.getCurrentUser();

    function testAjax() {
        axios
            .get('/test')
            .then((data) => {
                if (data && data.data && data.data.JWT_RESULT) {
                    alert(
                        `토큰 오류가 발생했습니다. ( message : ${data.data.JWT_RESULT})`
                    );
                    //로그아웃
                    logOutProcess();
                }
                console.dir(data);
            })
            .catch((error) => {
                console.dir(error);
            });

        // custom module로 했더니, accessToken을 제때 못가져옴..
        // 페이지 새로고침해야 가져오니 이건 모듈이 언제 로드되는지 라이프사이클 확인 필요..
        // 또, history를 모듈내에서 사용시도해봤으나 실패.. 이러면 logout이라는 공통로직도 못넣음 ;;
        // 일단은 공통모듈화는 제쳐두고 개발 진행하자.
        // axios('get', '/test')
        //     .then((data: any) => {
        //         if (data) {
        //             console.log('api success');
        //             console.dir(data);
        //         } else {
        //             AuthService.logout(props);
        //         }
        //     })
        //     .catch((error: any) => {
        //         console.dir(error);
        //     });
    }

    const goChattingPage = () => {
        props.history.push('./chatting');
    };

    return (
        <>
            <div>로그인 성공!</div>
            <div>환영합니다, {currentUser.memberName}님!</div>
            <div>TOKEN : {currentUser.accessToken}</div>
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

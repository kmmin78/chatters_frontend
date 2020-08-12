import React from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import AuthService from 'auth/authService';

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

export default function Profile<T>(props: T) {
    const classes = useStyles();

    function logOutProcess() {
        AuthService.logout(props);
    }

    const currentUser = AuthService.getCurrentUser();

    return (
        <>
            <div>로그인 성공!</div>
            <div>환영합니다, {currentUser.memberName}님!</div>
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

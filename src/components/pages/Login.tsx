import React, { useRef } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
// import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
// import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import ChatIcon from '@material-ui/icons/Chat';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { useSpring, useSprings, animated } from 'react-spring';
import * as CommonUtil from 'utils/common';
import * as Constants from 'constants/constants';
import authHeader from 'auth/authHeader';
import AuthService from 'auth/authService';
import axios from 'axios';

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

function Title() {
    const classes = useStyles();
    return (
        <>
            <Avatar className={classes.avatar}>
                <ChatIcon />
            </Avatar>
            <Typography component='h1' variant='h5'>
                <Link color='inherit' href='/'>
                    Chatters
                </Link>
            </Typography>
        </>
    );
}

function Form(props: any) {
    const userId = useRef<HTMLInputElement>(null);
    const userPassword = useRef<HTMLInputElement>(null);
    const classes = useStyles();

    //로그인
    const loginProcess = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (userId.current !== null && userPassword.current !== null) {
            if (CommonUtil.isEmpty(userId.current.value)) {
                alert('아이디를 입력해 주세요.');
                return;
            }
            if (CommonUtil.isEmpty(userPassword.current.value)) {
                alert('비밀번호를 입력해 주세요.');
                return;
            }

            AuthService.login(
                userId.current.value,
                userPassword.current.value
            ).then(
                (data) => {
                    //axios default 세팅
                    const authorization = authHeader().Authorization;
                    axios.defaults.baseURL = Constants.API_URL;
                    axios.defaults.headers.common[
                        'Authorization'
                    ] = authorization;
                    props.history.push('/profile');
                    console.dir(data);
                },
                (error) => {
                    const resMessage =
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString();
                    if (
                        error.response &&
                        error.response.status &&
                        error.response.status === 401
                    ) {
                        alert('아이디 혹은 비밀번호가 일치하지 않습니다.');
                    } else {
                        alert(
                            '서버에 연결 되지 않았습니다. 개발팀에 문의 해주세요.'
                        );
                    }
                    console.log(resMessage);
                }
            );
        }
    };
    return (
        <>
            <form className={classes.form} onSubmit={loginProcess} noValidate>
                <TextField
                    variant='outlined'
                    margin='normal'
                    required
                    fullWidth
                    id='email'
                    label='이메일'
                    name='email'
                    autoComplete='email'
                    inputRef={userId}
                    defaultValue='admin'
                    autoFocus
                />
                <TextField
                    variant='outlined'
                    margin='normal'
                    required
                    fullWidth
                    name='password'
                    label='패스워드'
                    type='password'
                    id='password'
                    defaultValue='chatters1@#'
                    autoComplete='current-password'
                    inputRef={userPassword}
                />
                {/* <FormControlLabel
                        control={<Checkbox value='remember' color='primary' />}
                        label='Remember me'
                    /> */}
                <Button
                    fullWidth
                    variant='contained'
                    color='primary'
                    className={classes.submit}
                    type='submit'
                >
                    로그인
                </Button>
                {/* <Grid container>
                        <Grid item xs>
                            <Link href='#' variant='body2'>
                                Forgot password?
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link href='#' variant='body2'>
                                {"Don't have an account? Sign Up"}
                            </Link>
                        </Grid>
                    </Grid> */}
            </form>
        </>
    );
}

function Copyright() {
    return (
        <Typography variant='body2' color='textSecondary' align='center'>
            {'Copyright © '}
            <Link color='inherit' href='/'>
                mskim
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

export default function Login(props: any) {
    const classes = useStyles();

    const formArray = [<Title />, <Form {...props} />];
    //form 애니메이션 처리
    const springs = useSprings(
        formArray.length,
        formArray.map((item) => {
            return {
                config: {
                    duration: 400,
                },
                to: {
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    opacity: 1,
                    transform: 'translate3d( 0, 0, 0)',
                },
                from: { opacity: 0, transform: 'translate3d( 0, 30px, 0)' },
            };
        })
    );
    //copyright 애니메이션 처리
    const boxProps = useSpring({
        config: {
            duration: 400,
        },
        to: {
            opacity: 1,
            transform: 'translate3d( 0, 0, 0)',
        },
        from: { opacity: 0, transform: 'translate3d( 0, 30px, 0)' },
    });

    return (
        <Container component='main' maxWidth='xs'>
            <CssBaseline />
            <div className={classes.paper}>
                {springs.map((props, index) => (
                    <animated.div
                        style={props}
                        key={index}
                        children={formArray[index]}
                    />
                ))}
                {/* <Title />
                <Form /> */}
            </div>
            <animated.div style={boxProps}>
                <Box mt={8}>
                    <Copyright />
                </Box>
            </animated.div>
        </Container>
    );
}

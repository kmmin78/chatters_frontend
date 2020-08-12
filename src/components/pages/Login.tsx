import React from 'react';
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
                Chatters
            </Typography>
        </>
    );
}

function Form() {
    const classes = useStyles();
    return (
        <>
            <form className={classes.form} noValidate>
                <TextField
                    variant='outlined'
                    margin='normal'
                    required
                    fullWidth
                    id='email'
                    label='이메일'
                    name='email'
                    autoComplete='email'
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
                    autoComplete='current-password'
                />
                {/* <FormControlLabel
                        control={<Checkbox value='remember' color='primary' />}
                        label='Remember me'
                    /> */}
                <Button
                    onClick={() => {
                        alert('login process!');
                    }}
                    fullWidth
                    variant='contained'
                    color='primary'
                    className={classes.submit}
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

export default function Login() {
    const classes = useStyles();

    const formArray = [<Title />, <Form />];

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

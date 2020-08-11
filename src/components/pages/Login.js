import React from 'react';
import { Button } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

export default function Login() {
    return (
        <>
            <AppBar position='static'>
                <Toolbar>
                    <Typography variant='title' color='inherit'>
                        React Material-UI Sample
                    </Typography>
                </Toolbar>
            </AppBar>
            <div>
                <p>로그인 페이지입니다.</p>
            </div>
            <Button variant='contained' color='primary'>
                Hi
            </Button>
        </>
    );
}

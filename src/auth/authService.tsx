// import * as Constants from 'constants/constants';
import axios from 'axios';

type CurrentUserTypes = {
    username: string | null;
    memberName: string | null;
    accessToken: string | null;
    tokenType: string | null;
    roles: string[] | null;
};

class AuthService {
    login(username: string, password: string) {
        const data = {
            username,
            password,
        };
        return axios.post('/login', data).then((res) => {
            if (res.data.accessToken) {
                localStorage.setItem('user', JSON.stringify(res.data));
            }
            return res.data;
        });
    }

    logout<T>(props: any) {
        localStorage.removeItem('user');
        axios.defaults.headers.common['Authorization'] = null;
        if (props.history) {
            props.history.push('/');
        }
    }

    getCurrentUser(): CurrentUserTypes {
        const userItem: string | null = localStorage.getItem('user');
        if (userItem === null) {
            return {
                username: null,
                memberName: null,
                accessToken: null,
                tokenType: null,
                roles: null,
            };
        }
        return JSON.parse(userItem);
    }

    checkAuth<T>(props: any) {
        const currentUser = this.getCurrentUser();
        if (!currentUser.accessToken) {
            if (props.history) {
                props.history.push('/');
            }
        }
    }
}

export default new AuthService();

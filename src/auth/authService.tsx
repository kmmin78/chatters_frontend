// import * as Constants from 'constants/constants';
import axios from 'axios';

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
        if (props.history) {
            props.history.push('/');
        }
    }

    getCurrentUser(): JSON {
        const userItem: string | null = localStorage.getItem('user');
        if (userItem === null) {
            return JSON.parse('{}');
        }
        return JSON.parse(userItem);
    }

    checkAuth<T>(props: any) {
        const currentUser = this.getCurrentUser();
        if (!currentUser) {
            if (props.history) {
                props.history.push('/');
            }
        }
    }
}

export default new AuthService();

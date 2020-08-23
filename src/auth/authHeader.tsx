//import { stringify } from 'querystring';

export default function authHeader() {
    const userItem: string | null = localStorage.getItem('user');
    if (userItem === null) {
        return {};
    }
    const user = JSON.parse(userItem);
    const accessToken: string = JSON.stringify(user.accessToken);
    if (user && accessToken) {
        return { Authorization: `Bearer ${accessToken}` };
    } else {
        return {};
    }
}

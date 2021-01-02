import AuthService from 'auth/authService';
import moment from 'moment';
// , webSocket, inputMessage, type, url
export const SendMessage = (...args) => {
    const [webSocket, inputMessage, type, url] = args;

    if (!webSocket) return console.log(`SendMessage : webSocket 객체 없음`);
    if (!inputMessage) return console.log(`SendMessage : inputMessage 없음`);
    if (!type) return console.log(`SendMessage : type 없음`);
    if (!url) return console.log(`SendMessage : url 없음`);
    if (inputMessage) {
        const {
            username,
            memberName,
            accessToken,
        } = AuthService.getCurrentUser();

        const header = {
            accessToken,
        };

        const message = {
            username: username,
            memberName: memberName,
            type,
            message: inputMessage,
            sendDate: moment().format('YYYY-MM-DD HH:mm:ss'),
        };
        webSocket.sendMessage(
            url,
            JSON.stringify(message),
            header //header
        );
    }
};

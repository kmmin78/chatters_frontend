import AuthService from 'auth/authService';
import AuthHeader from 'auth/authHeader';
import moment from 'moment';
// , webSocket, inputMessage, type, url
export const SendMessage = (...args) => {
    const [webSocket, inputMessage, type, url, roomId] = args;

    if (!webSocket) return console.log(`SendMessage : webSocket 객체 없음`);
    if (!inputMessage) return console.log(`SendMessage : inputMessage 없음`);
    if (!type) return console.log(`SendMessage : type 없음`);
    if (!url) return console.log(`SendMessage : url 없음`);
    if (!roomId) return console.log(`SendMessage : roomId 없음`);
    if (inputMessage) {
        const { username, memberName } = AuthService.getCurrentUser();

        const message = {
            roomId,
            username,
            memberName,
            type,
            message: inputMessage,
            sendDate: moment().format('YYYY-MM-DD HH:mm:ss'),
        };
        webSocket.sendMessage(
            url,
            JSON.stringify(message),
            AuthHeader() //header
        );
    }
};

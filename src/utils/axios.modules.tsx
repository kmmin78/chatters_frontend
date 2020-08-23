import axios, { /*AxiosRequestConfig,*/ Method } from 'axios';
import * as Constants from 'constants/constants';
import authHeader from 'auth/authHeader';

const axios_instance = axios.create({
    baseURL: Constants.API_URL,
    headers: { Authorization: authHeader().Authorization },
});

const custom_axios = (method: Method, url: string, data?: any): any => {
    const config =
        method === 'get' || method === 'GET'
            ? {
                  method,
                  url,
                  params: data,
              }
            : { method, url, data };

    return axios_instance(config).then((data) => {
        if (data && data.data && data.data.JWT_RESULT) {
            const result_code = data.data.JWT_RESULT;
            switch (result_code) {
                case 'EXPIRED':
                    alert(
                        `토큰 오류가 발생했습니다. (${result_code} : 만료되었음)`
                    );
                    break;
                case 'INVALID_TOKEN':
                    alert(
                        `토큰 오류가 발생했습니다. (${result_code} : 올바른 토큰이 아님)`
                    );
                    break;
                case 'INVALID_SIGNATURE':
                    alert(
                        `토큰 오류가 발생했습니다. (${result_code} : 올바른 형식이 아님)`
                    );
                    break;
                case 'UNSUPPORTED':
                    alert(
                        `토큰 오류가 발생했습니다. (${result_code} : 지원되는 토큰 형식이 아님)`
                    );
                    break;
                case 'JWT_CLAIMS_EMPTY':
                    alert(
                        `토큰 오류가 발생했습니다. (${result_code} : 클레임이 비어있음)`
                    );
                    break;
                default:
                    alert(
                        `토큰 오류가 발생했습니다. (${result_code} : 정의되지 않은 코드)`
                    );
                    break;
            }
            return null;
        }
        return data;
    });
};

export default custom_axios;

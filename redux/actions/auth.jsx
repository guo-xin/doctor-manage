import * as actions from './actions';
import fetch from 'isomorphic-fetch';

//登录
export const signIn = (params) => {
    let data = {
        userName: params.u,
        passwd: params.p
    };

    return fetch(`${actions.WEB_API_URI}/system/hdmm/signin`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify(data)
    });
};


//退出
export const signOut= (userName) => {
    let action = actions.SIGN_OUT;

    return {
        // 要在之前和之后发送的 action types
        types: [action + '_REQUEST', action + '_SUCCESS', action + '_FAILURE'],
        // 检查缓存 (可选):
        //shouldCallAPI: (state) => !state.users[userId],
        // 进行取：
        callAPI: () => fetch(`${actions.WEB_API_URI}/auth/signout?u=${userName}`),
        // 在 actions 的开始和结束注入的参数
        payload: {userName}
    };
};



import React from 'react';
import cookie from 'react-cookie';
import {Spin} from 'antd';

export function requireAuthentication(Component) {

    class AuthenticatedComponent extends React.Component {

        state = {
            isAuthenticated: false
        };


        componentWillMount() {
            this.checkAuth();
        }


        checkAuth() {
            let cookieData = cookie.load('HEALTHSTAT');

            if (cookieData && cookieData.u) {
                this.setState({
                    isAuthenticated: true
                });
            } else {
                this.reLogin();
            }

        }

        reLogin() {
            let ext = window.env === 'prod' ? '.jsp' : '.html';

            window.location.href = 'login' + ext;
        }

        render() {
            let {isAuthenticated} = this.state;

            let data = (isAuthenticated === true)
                ? <Component {...this.props}/>
                : <Spin>
                <div style={{height: document.body.clientHeight}}/>
            </Spin>;

            return data;

        }
    }

    return AuthenticatedComponent;

}
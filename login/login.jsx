import React, {Component} from 'react';
import {Form, Input, Button, Modal, message} from 'antd';
import cookie from 'react-cookie';
import Image from '../components/image/image.jsx';
import '../assets/style/antd.less';
import styles from './login.less';

import {signIn} from 'redux/actions/auth';
const FormItem = Form.Item;

function noop() {
    return false;
}


class Login extends Component {
    state = {
        disabled: false
    };


    componentWillMount() {

    }


    //登录相关请求验证
    signIn(values) {
        let ext = window.env === 'prod' ? '.jsp' : '.html';
        const {dispatch} = this.props;
        signIn(values).then((response)=> {
            if (response.status >= 400) {
                this.setError();
            }

            return response.json();

        }).then(
            (obj)=> {
                if (obj.result === 0) {
                    this.setCookie(values);
                    window.location.href = 'index' + ext;
                } else {
                    this.setError();
                }
            },
            ()=> {
                this.setError();
            }
        );
    }

    setCookie(data) {
        //将用户姓名存入cookie
        let exp = new Date();
        exp.setTime(exp.getTime() + 24 * 60 * 60 * 1000);
        cookie.save('HEALTHSTAT', {
            u: data.u
        }, {expires: exp});
    }

    setError() {
        let {setFields, getFieldValue} = this.props.form;

        setFields({
            u: {
                value: getFieldValue('u'),
                errors: ['']
            },
            p: {
                value: getFieldValue('p'),
                errors: ['用户名或者密码错误']
            }
        });

        this.setState({
            disabled: false
        });
    }

    //点击登录按钮验证用户名密码
    handleSubmit(e) {
        e.preventDefault();

        this.setState({
            disabled: true
        });
        this.props.form.validateFields((errors, values) => {
            if (!!errors) {
                this.setState({
                    disabled: false
                });
                return;
            } else {
                this.signIn(values);
            }
        });
    }

    render() {
        const {getFieldProps, getFieldError} = this.props.form;
        const {data={}} = this.state;

        return (
            <div className={styles.wrapper}>
                <div>
                    <Form horizontal form={this.props.form} onSubmit={(e)=>this.handleSubmit(e)}>
                        <FormItem >
                            <div className={styles.avatar}>
                                <span>
                                    <Image src={data.h || require('assets/images/defaultDocHead.png')}
                                           defaultImg={require('assets/images/defaultDocHead.png')}/>
                                </span>
                            </div>
                        </FormItem>
                        <FormItem >
                            <Input autoComplete="off"
                                   onContextMenu={noop}
                                   onPaste={noop}
                                   placeholder="请输入账户名"
                                {...getFieldProps('u', {
                                    initialValue: data.u || '',
                                    rules: [
                                        {
                                            whitespace: true,
                                            required: true, message: '请输入账户名'
                                        }
                                    ]
                                })} />
                        </FormItem>
                        <FormItem>
                            <Input autoComplete="off"
                                   onContextMenu={noop}
                                   onPaste={noop}
                                   type="password"
                                   placeholder="请输入密码"
                                {...getFieldProps('p', {
                                    initialValue: '',
                                    rules: [
                                        {
                                            whitespace: true,
                                            required: true, message: '请输入密码'
                                        }
                                    ]
                                })} />

                        </FormItem>

                        <FormItem>
                            <Button disabled={this.state.disabled} type="primary" size="small"
                                    htmlType="submit">登录</Button>
                        </FormItem>
                    </Form>

                    <p>您好，欢迎您使用“我有医生”管理后台</p>
                    <p>祝您一天好心情</p>
                </div>
            </div>
        );
    }
}


Login = Form.create()(Login);

export default Login;
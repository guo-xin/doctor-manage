import styles from './header.less';
import React, {Component} from 'react';
import cookie from 'react-cookie';
import {Menu, Dropdown, Icon, Modal} from 'antd';
import {Link} from 'react-router';
import {connect} from 'react-redux';

import * as global from 'util/global';

import Image from '../image/image';

const confirm = Modal.confirm;

class User extends Component {
    componentDidMount() {

    }

    //退出操作
    logout() {
        let content = "";
        let ext = window.env === 'prod' ? '.jsp' : '.html';
        confirm({
            title: '你确认要退出“医端后台”管理系统吗？',
            content: content,
            onOk: ()=> {
                cookie.remove('HEALTHSTAT');
                window.location.href = 'login' + ext;
            },
            onCancel: ()=> {
            }
        });
    }

    //医生状态下拉列表
    getMenu() {
        return (<Menu onClick={this.onMenuChange}>
            <Menu.Item key="5" name="退出"><Icon type="logout"/>退出</Menu.Item>
        </Menu>);
    }

    //切换医生状态操作，退出操作
    onMenuChange = ({item})=> {
        if (item.props.eventKey == 5) {
            //退出操作
            this.logout();
        }
    };


    render() {
        const menu = this.getMenu();
        return (
            <div className={styles.user} id="headerUser">

                <Link activeClassName={styles.active} to="">
                    <span className={styles.avatar}>
                        <Image src="" defaultImg={global.defaultDocHead}/>
                    </span></Link>
                <Dropdown overlay={menu} getPopupContainer={()=>document.getElementById('headerUser')}>
                    <a className={styles.dropdown} href="javascript:void(0)">
                        {cookie.load('HEALTHSTAT').u || ''} <Icon type="down"/>
                    </a>
                </Dropdown>

            </div>
        );
    }
}

export default connect()(User);
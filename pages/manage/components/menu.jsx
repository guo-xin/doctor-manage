import React, {Component}from 'react';
import {Link} from 'react-router';
import styles from './menu.less'

export default class Menu extends Component{
    render(){
        return(<ul className={styles.wrapper}>
            <li>
                <Link activeClassName={styles.active} to="/manage/hospital">医院管理</Link>
            </li>
            <li>
                <Link activeClassName={styles.active} to="/manage/doctor">医生管理</Link>
            </li>
            <li>
                <Link activeClassName={styles.active} to="/manage/schedule">排班计划</Link>
            </li>
        </ul>)
    }
}
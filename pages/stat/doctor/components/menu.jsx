import React, {Component}from 'react';
import {Link} from 'react-router';
import styles from './menu.less'

export default class Menu extends Component{
    render(){
        return(<ul className={styles.wrapper}>
            <li>
                <Link activeClassName={styles.active} to="/stat/doctor/case">病历统计</Link>
            </li>
            <li>
                <Link activeClassName={styles.active} to="/stat/doctor/call">通话记录</Link>
            </li>
        </ul>)
    }
}
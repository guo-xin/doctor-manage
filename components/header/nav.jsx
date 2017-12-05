import styles from './header.less';
import React from 'react';
import {Link} from 'react-router';

class Nav extends React.Component {

    render() {
        return (
            <ul className={styles.nav}>
                <li><Link activeClassName={styles.active} to="/stat">医端统计</Link></li>
                <li><Link activeClassName={styles.active} to="/manage">医端管理</Link></li>
            </ul>
        );
    }
}

export default Nav;
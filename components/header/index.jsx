import styles from './header.less';

import React from 'react';
import Nav from './nav';
import Logo from './logo';
import User from  './user';

export default class Header extends React.Component{
    render(){
        return(
            <div className={styles.wrapper}>
                <Logo/>
                <div className={styles.navAndMessage}>
                    <Nav/>
                </div>
                <User/>
            </div>
        );
    }
}



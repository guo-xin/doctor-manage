import styles from './manage.less';
import React, {Component}from 'react';
import Menu from './components/menu';

export default class Manage extends Component{
    render(){
        return(
            <div className={styles.wrapper}>
                <Menu/>
                {this.props.children}
            </div>
        );
    }
}
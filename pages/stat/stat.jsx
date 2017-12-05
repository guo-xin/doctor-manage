import styles from './stat.less';
import React, {Component}from 'react';

export default class Stat extends Component{
    render(){
        return(
            <div className={styles.wrapper}>
                {this.props.children}
            </div>
        );
    }
}
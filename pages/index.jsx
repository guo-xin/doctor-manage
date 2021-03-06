import '../assets/style/antd.less';
import styles from './layout.less';

import React from 'react';
import {message} from 'antd';
import Header from '../components/header';
import {resetToken} from 'redux/actions/auth';


class App extends React.Component {
    constructor(props) {
        super(props)
    }

    componentDidMount(){
        message.config({
            duration: 2
        });
    }

    render() {
        return (
            <div>
                <Header></Header>
                <div className={styles.container}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}


module.exports = App;
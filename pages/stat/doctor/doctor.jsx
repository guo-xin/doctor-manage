import React, {Component}from 'react';
import {Spin} from 'antd';
import Menu from './components/menu';
import styles from './doctor.less';

import {connect} from 'react-redux';

class Doctor extends Component {
    state = {
        loading: false
    };

    render() {
        let {loading}=this.state;
        return (
            <div className={styles.wrapper}>
                <Spin spinning={loading}>
                    <Menu/>
                    <div className={styles.content}>
                        <div>
                            {this.props.children}
                        </div>
                    </div>
                </Spin>
            </div>

        );
    }
}


export default connect()(Doctor);

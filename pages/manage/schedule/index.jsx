import React, {Component}from 'react';
import {Spin} from 'antd';
import styles from './index.less';

import {connect} from 'react-redux';

class Index extends Component {
    state = {
        loading: false
    };

    render() {
        let {loading}=this.state;
        return (
            <div className={styles.wrapper}>
                <Spin spinning={loading}>
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


export default connect()(Index);

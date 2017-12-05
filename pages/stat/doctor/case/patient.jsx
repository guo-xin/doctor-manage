import React from 'react';
import {Form} from 'antd';
import {connect} from 'react-redux';
import styles from './patient.less';
import * as global from 'util/global';
import Image from 'components/image/image.jsx';

const FormItem = Form.Item;

class Patient extends React.Component {
    constructor(props) {
        super(props);
    }


    render() {
        let {patient = {}} = this.props;

        return (
            <div className={styles.patientInfo}>
                <div className={styles.panelBody}>

                    <div className="info">
                        <Form inline>
                            <FormItem>
                                <span className="pic">
                                    <Image src={patient.head || global.defaultHead} defaultImg={global.defaultHead} />
                                </span>
                            </FormItem>
                            <FormItem label="姓名：">{patient.realName || '--'}</FormItem>
                            <FormItem label="性别：">{global.getGenderText(patient.sex) || '--'}</FormItem>
                            <FormItem label="年龄：">{global.getAge(patient.birthday) || '--'}</FormItem>
                            <FormItem label="电话号码：">{patient.phoneNumber || '--'}</FormItem>
                            <FormItem label="与用户关系：">{global.getRelationText(patient.relation) || '--'}</FormItem>
                        </Form>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect()(Patient);
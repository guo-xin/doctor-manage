import React from 'react';
import Patient from './patient';
import Emr from './emr';
import {message, Modal} from 'antd';
import styles from './detail.less';

import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import {
    getCaseDetailByCaseId,
    getPatientByPatientId,
    getCallByInqiryId,
    getDiagnosisByUrl
} from 'redux/actions/stat';

import * as global from 'util/global';

class Detail extends React.Component {
    state = {};

    constructor(props) {
        super(props);
    }


    componentDidMount() {
        this.resetData();
    }

    resetData() {
        let {location={}, dispatch} = this.props;
        let {query={}} = location;

        //患者信息
        if (query.patientId) {
            dispatch(getPatientByPatientId(query.patientId));
        }

        //病历诊断相关信息
        if (query.caseID) {
            dispatch(getCaseDetailByCaseId(query.caseID)).then((action)=> {
                let caseDetail = (action.response || {}).data || {};
                if (caseDetail.opinions && caseDetail.opinions.indexOf("http") > -1) {
                    
                    dispatch(getDiagnosisByUrl(caseDetail.opinions));
                }
            });
        }

        //通话记录
        let params = [];
        if (query.inquiryId) {
            params.push("inquiryId=" + query.inquiryId);
        }
        if (query.doctorId) {
            params.push("doctorId=" + query.doctorId);
        }
        params = params.join("&");

        if (query.inquiryId || query.doctorId) {
            dispatch(getCallByInqiryId(params));
        }

    }

    //通话记录列表
    getCallRecords(callRecords = []) {
        let list;
        if (callRecords.length > 0) {
            list = callRecords.map((item, index)=> {
                return (
                    <li key={index}>
                        <a href={item.recordURL} target="_blank">
                            <span
                                className={styles.recordsLeft + ' ' + (item.callType==2? styles.videoIcon:styles.audioIcon)}>
                            </span>
                            <span className={styles.recordsRight}>
                                <span className={styles.date}>
                                    {global.formatDate(item.startTime, 'MM月dd日 HH:mm')}
                                </span>

                                <span className={styles.duration}>
                                    时长：{global.formatTime((item.endTime - item.startTime) / 1000)}
                                </span>
                            </span>
                        </a>
                    </li>
                );
            });

            return <ul className={styles.callRecords}>{list}</ul>
        }

        return null;
    }

    //返回列表
    back() {
        this.props.router.goBack();
    }


    render() {
        const {patientInfo={}, caseDetail={}, callList=[], options=''} = this.props;
        let records = this.getCallRecords(callList);
        return (
            <div className={styles.wrapper}>
                <div className={styles.operations}>
                    <ul className={styles.back}>
                        <li>
                            <a href="javascript:;" onClick={::this.back}>
                                <img src={require('assets/images/op1.png')} alt=""/><span>返回目录</span>
                            </a>
                        </li>
                    </ul>
                </div>
                <div className={styles.edit}>
                    <Patient patient={patientInfo}/>
                    <Emr caseData={caseDetail} options={options}/>
                    <div className={styles.recordsContainer}>
                        {records}
                    </div>
                </div>

            </div>
        );
    }
}

const mapStateToProps = (globalStore) => {
    const {statStore}  = globalStore;

    return {
        patientInfo: Object.assign({}, statStore.patientInfo),
        caseDetail: Object.assign({}, statStore.caseDetail),
        callList: statStore.callList,
        options: statStore.options
    };
};


Detail = connect(mapStateToProps)(Detail);

export default withRouter(Detail);
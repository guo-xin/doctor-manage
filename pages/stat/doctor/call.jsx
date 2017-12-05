import React from 'react';
import {Table, Form, Input, Select, Button, DatePicker} from 'antd';
import styles from './doctor.less';

import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import {
    getConditionCallList,
    getAllHospital,
    exportConditionCallList,
    setCurrentCall
} from 'redux/actions/stat';
import * as global from 'util/global';

const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;

class Call extends React.Component {

    columns = [
        {
            title: '医生ID',
            dataIndex: 'operator',
            width: '6%',
            render: (text)=> {
                return text;
            }
        },
        {
            title: '医生姓名',
            dataIndex: 'realName',
            width: '6%',
            render: (text)=> {
                return text;
            }
        },
        {
            title: '医端角色',
            dataIndex: 'operatorRoleCode',
            width: '6%',
            render(text) {
                return (text === 104 ? "医生" : "医助");
            }
        },
        {
            title: '用户ID',
            dataIndex: 'userId',
            width: '6%',
            render(text) {
                return text;
            }
        },
        {
            title: '用户姓名',
            dataIndex: 'userName',
            width: '7%',
            render(text) {
                return text;
            }
        },
        {
            title: '通话双方',
            dataIndex: 'inquiryCallType',
            width: '6%',
            render(text) {
                return global.getInquiryCallTypeText(text);
            }
        },
        {
            title: '呼叫方式',
            dataIndex: 'callType',
            width: '6%',
            render(text) {
                return global.getCallTypeText(text);
            }
        },
        {
            title: '用户电话',
            dataIndex: 'mobilePhone',
            width: '7%',
            render(text) {
                return text;
            }
        },
        {
            title: '拨打时间',
            dataIndex: 'answerTime',
            width: '10%',
            render(text) {
                return global.formatDate(text, 'yyyy-MM-dd HH:mm');
            }
        },
        {
            title: '接听时间',
            dataIndex: '',
            width: '7%',
            render(text) {
                return text;
            }
        },
        {
            title: '等待时间',
            dataIndex: '',
            width: '6%',
            render(text) {
                return text;
            }
        },
        {
            title: '音频时长',
            dataIndex: 'timedifferent',
            width: '6%',
            render(text) {
                return global.formatTime(text);
            }
        },
        {
            title: '异常描述',
            dataIndex: 'byeType',
            width: '6%',
            render(text) {
                return global.getbyeTypeText(text);
            }
        },
        {
            title: '病历ID',
            dataIndex: 'historyCaseId',
            width: '5%',
            render: (text, record) => {
                if (text) {
                    return <a href="javascript:;" onClick={()=>this.goToDetail(text,record)}>查看详情</a>;
                } else {
                    return null;
                }
            }
        },

        {
            title: '操作',
            dataIndex: 'recordURL',
            width: '6%',
            render: (text)=> {
                if (text && text.indexOf("http") > -1) {
                    return <a href={text} target="_blank">下载</a>;
                } else {
                    return null;
                }

            }
        }
    ];

    state = {
        loading: false,
        exportConditions: {}
    };

    conditions = {};


    //查看病历详情
    goToDetail(text, record) {
        let {router} = this.props;
        let params = [];

        if (record.patientId) {
            params.push("patientId=" + record.patientId);
        }
        if (record.inquiryId) {
            params.push("inquiryId=" + record.inquiryId);
        }
        if (record.operator) {
            params.push("doctorId=" + record.operator);
        }
        if (record.historyCaseId) {
            params.push("caseID=" + record.historyCaseId);
        }

        params = params.join("&");
        router.push(`/stat/doctor/caseDetail?${params}`);
    }


    //分页的切换页数
    handleTableChange(pagination, filters, sorter) {
        this.conditions = Object.assign(this.conditions, {
            size: pagination.pageSize,
            curr: pagination.current
        });

        this.fetch();
    }

    //拼请求参数
    formatConditions(condition) {
        let list = [];
        let cons = condition;

        for (let key in cons) {
            if (cons[key]) {
                list.push(key + '=' + cons[key]);
            }
        }
        return list.join('&');
    }


    //发送请求，获取通话列表数据
    fetch() {
        const {dispatch} = this.props;
        this.conditions = Object.assign(this.conditions, this.props.form.getFieldsValue());
        let callTime = this.conditions.callTime;

        if(this.conditions.startTime){
            delete this.conditions.startTime;
        }

        if(this.conditions.endTime){
            delete this.conditions.endTime;
        }

        for (let item in callTime) {
            if (callTime[item]) {
                this.conditions = Object.assign(this.conditions, {
                    startTime: global.formatDate(callTime[0], 'yyyy-MM-dd HH:mm:ss'),
                    endTime: global.formatDate(callTime[1], 'yyyy-MM-dd HH:mm:ss')
                });
            }
        }

        dispatch(setCurrentCall({
            callConditions: this.conditions
        }));
        
        delete this.conditions.callTime;
        this.state.exportConditions = Object.assign({}, this.conditions);

        let paramsStr = this.formatConditions(this.conditions);
        this.setState({loading: true});
        dispatch(getConditionCallList(paramsStr)).then(
            ()=> {
                this.changeState(false);
            },
            ()=> {
                this.changeState(false);
            }
        );

    }

    //页面初始化，请求所有医院列表
    componentDidMount() {
        this._isMounted = true;

        const {dispatch} = this.props;
        this.init();
        dispatch(getAllHospital());
        this.fetch();
    }


    componentWillUnmount() {
        this._isMounted = false;
    }

    //表单赋值
    init() {
        const {callConditions={}, form}=this.props;
        this.conditions = Object.assign(this.conditions, {
            size: callConditions.size,
            curr: callConditions.curr
        });
        form.setFieldsValue({
            hospitalId: callConditions.hospitalId,
            isException: callConditions.isException,
            operatorRoleCode: callConditions.operatorRoleCode,
            inquiryCallType: callConditions.inquiryCallType,
            callTime: callConditions.callTime
        })
    }

    changeState(flag) {
        if (this._isMounted) {
            this.setState({loading: flag});
        }
    }

    //搜索按钮
    handleSubmit = (e) => {
        e.preventDefault();
        this.conditions = Object.assign(this.conditions, {
            curr: 1
        });

        this.fetch();
    };

    //导出excel功能
    export() {
        exportConditionCallList(this.state.exportConditions);
    }

    render() {
        const {calls, hospital, callConditions={}} = this.props;
        const {getFieldProps} = this.props.form;

        let {data, pagination} = calls;
        pagination.current = callConditions.curr;
        
        //医院列表
        let hospitalList = hospital.map((item, index)=> {
            return (<Option key={index} value={item.id}>{item.hospitalName}</Option>);
        });

        return (
            <div>
                <div className="panel">
                    <div className={styles.panelHead}>
                        <Form className={styles.search} inline onSubmit={this.handleSubmit}>
                            <FormItem label="选择医院：">
                                <Select {...getFieldProps('hospitalId', {initialValue: ''})}>
                                    <Option value="">全部</Option>
                                    {hospitalList}
                                </Select>
                            </FormItem>

                            <FormItem label="是否正常：">
                                <Select {...getFieldProps('isException', {initialValue: ''})}>
                                    <Option value="">全部</Option>
                                    <Option value="0">异常通话记录</Option>
                                    <Option value="1">正常通话记录</Option>
                                </Select>
                            </FormItem>

                            <FormItem label="医端角色：">
                                <Select {...getFieldProps('operatorRoleCode', {initialValue: ''})}>
                                    <Option value="">全部</Option>
                                    <Option value="104">医生</Option>
                                    <Option value="105">医助</Option>
                                </Select>
                            </FormItem>

                            <FormItem label="通话双方：">
                                <Select {...getFieldProps('inquiryCallType', {initialValue: ''})}>
                                    <Option value="">全部</Option>
                                    <Option value="0">医端to用户</Option>
                                    <Option value="1">用户to医端</Option>
                                </Select>
                            </FormItem>

                            <FormItem label="拨打时间：">
                                <RangePicker showTime {...getFieldProps('callTime', {initialValue: ''})}
                                             format="yyyy-MM-dd HH:mm:ss"/>
                            </FormItem>

                            <FormItem>
                                <Button type="primary" htmlType="submit">查询</Button>
                            </FormItem>
                            <FormItem>
                                <Button type="primary" onClick={::this.export}>导出Excel</Button>
                            </FormItem>
                        </Form>
                    </div>
                    <div className={styles.panelBody}>
                        <Table
                            rowKey={(record, index)=>{return record.key}}
                            columns={this.columns}
                            dataSource={data}
                            pagination={pagination}
                            loading={this.state.loading}
                            onChange={::this.handleTableChange}
                            locale={{emptyText:'没有符合条件的内容'}}
                            bordered/>
                    </div>
                </div>
            </div>

        );
    }
}

const mapStateToProps = (globalStore) => {
    const {statStore}  = globalStore;
    return {
        calls: statStore.calls,
        hospital: statStore.hospital,
        callConditions: Object.assign({}, statStore.callConditions)
    };
};
Call = Form.create()(Call);


export default withRouter(connect(mapStateToProps)(Call));
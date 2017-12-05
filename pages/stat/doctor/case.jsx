import React from 'react';
import {Table, Form, Input, Select, Button, DatePicker} from 'antd';
import styles from './doctor.less';

import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import {
    getAllDepartment,
    getConditionCaseList,
    getAllHospital,
    getDoctorByHospital,
    exportConditionCaseList,
    setCurrentCase
} from 'redux/actions/stat';
import * as global from 'util/global';

const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;

class Case extends React.Component {


    columns = [
        {
            title: '患者ID',
            dataIndex: 'patientId',
            width: '6%',
            render: (text)=> {
                return text;
            }
        },
        {
            title: '患者',
            dataIndex: 'patientRealName',
            width: '5%',
            render: (text)=> {
                return text;
            }
        },
        {
            title: '病历状态',
            dataIndex: 'status',
            width: '6%',
            render(text) {
                return global.getStatusText(text);
            }
        },
        {
            title: '问诊次数',
            dataIndex: 'sortNumber',
            width: '6%'
        },
        {
            title: '问诊时间',
            dataIndex: 'createdTime',
            width: '10%',
            render(text) {
                return global.formatDate(text, 'yyyy-MM-dd HH:mm');
            }
        },
        {
            title: '归档时间',
            dataIndex: 'updateTime',
            width: '10%',
            render(text, record) {
                if (record.status === 2) {
                    return global.formatDate(text, 'yyyy-MM-dd HH:mm');
                } else {
                    return null;
                }

            }
        },
        {
            title: '通话次数',
            dataIndex: 'num',
            width: '6%'
        },
        {
            title: '用户名',
            dataIndex: 'userName',
            width: '7%',
            render(text) {
                return text;
            }
        },
        {
            title: '用户手机',
            dataIndex: 'userMobilePhone',
            width: '10%',
            render(text) {
                return text;
            }
        },
        {
            title: '关系',
            dataIndex: 'relation',
            width: '5%',
            render(text) {
                return global.getRelationText(text);
            }
        },
        {
            title: '医院',
            dataIndex: 'hospitalName',
            width: '9%',
            render(text) {
                return text;
            }
        },
        {
            title: '科室',
            dataIndex: 'departmentName',
            width: '7%',
            render(text) {
                return text;
            }
        },
        {
            title: '医生',
            dataIndex: 'doctorRealName',
            width: '5%',
            render(text) {
                return text;
            }
        },

        {
            title: '操作',
            dataIndex: 'operations',
            width: '6%',
            render: (text, record)=> {
                return <a href="javascript:;" onClick={()=>this.goToDetail(text,record)}>查看详情</a>;
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
        if (record.doctorId) {
            params.push("doctorId=" + record.doctorId);
        }
        if (record.historyCaseId) {
            params.push("caseID=" + record.historyCaseId);
        }

        params = params.join("&");
        router.push(`/stat/doctor/caseDetail?${params}`);
    }

    handleTableChange(pagination, filters, sorter) {
        this.conditions = Object.assign(this.conditions, {
            size: pagination.pageSize,
            curr: pagination.current
        });

        this.fetch();
    }

    //格式化请求参数
    formatConditions() {
        let list = [];
        let cons = this.conditions;

        for (let key in cons) {
            if (cons[key]) {
                list.push(key + '=' + cons[key]);
            }
        }

        return list.join('&');
    }


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
        
        dispatch(setCurrentCase({
            caseConditions: this.conditions
        }));

        delete this.conditions.callTime;
        this.state.exportConditions = Object.assign({}, this.conditions);

        let paramsStr = this.formatConditions();
        this.setState({loading: true});
        dispatch(getConditionCaseList(paramsStr)).then(
            ()=> {
                this.changeState(false);
            },
            ()=> {
                this.changeState(false);
            }
        );

    }

    componentDidMount() {
        this._isMounted = true;

        const {dispatch} = this.props;
        dispatch(getAllDepartment());
        dispatch(getAllHospital());

        this.init();
        this.fetch();
        this.getDoctors();
    }

    //表单赋值
    init() {
        const {caseConditions={}, form}=this.props;
        this.conditions = Object.assign(this.conditions, {
            size: caseConditions.size,
            curr: caseConditions.curr
        });
        form.setFieldsValue({
            hospitalId: caseConditions.hospitalId,
            departmentId: caseConditions.departmentId,
            doctorId: caseConditions.doctorId,
            status: caseConditions.status,
            patientRealName: caseConditions.patientRealName,
            userName: caseConditions.userName,
            callTime: caseConditions.callTime
        })
    }

    //获取医生列表
    getDoctors() {
        const {dispatch, form} = this.props;
        const cons = this.conditions;
        let params = [];

        if (cons.hospitalId) {
            params.push('hospitalId=' + cons.hospitalId);
        }

        if (cons.departmentId) {
            params.push('hospitalDepartmentId=' + cons.departmentId);
        }

        let doctorId = form.getFieldValue('doctorId');

        dispatch(getDoctorByHospital(params.join('&'))).then(
            (action)=> {
                let data = (action.response || {}).data || [];

                let flag = true;

                for (let i = 0; i < data.length; i++) {
                    if (doctorId == data[i].doctorId) {
                        flag = false;
                        break;
                    }
                }

                if (flag) {
                    form.setFieldsValue({
                        doctorId: ''
                    });
                }

            }
        );
    }

    componentWillUnmount() {
        this._isMounted = false;
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
    }

    //导出excel功能
    export() {
        exportConditionCaseList(this.state.exportConditions)
    }

    //医院改变调用
    onHospitalChange(value) {
        this.conditions = Object.assign(this.conditions, {
            hospitalId: value
        });

        this.getDoctors();
    }

    //科室改变调用
    onDepartmentChange(value) {
        this.conditions = Object.assign(this.conditions, {
            departmentId: value
        });

        this.getDoctors();
    }

    render() {
        const {cases, department, hospital, doctor, caseConditions={}} = this.props;
        const {getFieldProps} = this.props.form;

        let {data, pagination} = cases;
        pagination.current = caseConditions.curr;

        //科室列表
        let departmentList = department.map((item, index)=> {
            return (<Option key={index} value={item.id}>{item.departmentName}</Option>);
        });

        //医院列表
        let hospitalList = hospital.map((item, index)=> {
            return (<Option key={index} value={item.id}>{item.hospitalName}</Option>);
        });

        //医生列表
        let doctorList = doctor.map((item, index)=> {
            return (<Option key={index} value={item.doctorId}>{item.doctorName}</Option>);
        });

        return (
            <div>
                <div className="panel">
                    <div className={styles.panelHead}>
                        <Form className={styles.search} inline onSubmit={this.handleSubmit}>
                            <FormItem label="选择医院：">
                                <Select {...getFieldProps('hospitalId', {
                                    initialValue: '',
                                    onChange: (val)=>this.onHospitalChange(val)
                                })}>
                                    <Option value="">所有医院</Option>
                                    {hospitalList}
                                </Select>
                            </FormItem>
                            <FormItem label="选择科室：">
                                <Select {...getFieldProps('departmentId', {
                                    initialValue: '',
                                    onChange: (val)=>this.onDepartmentChange(val)
                                })}>
                                    <Option value="">所有科室</Option>
                                    {departmentList}
                                </Select>
                            </FormItem>
                            <FormItem label="医生姓名：">
                                <Select {...getFieldProps('doctorId', {initialValue: ''})}>
                                    <Option value="">所有医生</Option>
                                    {doctorList}
                                </Select>
                            </FormItem>
                            <FormItem label="病历状态：">
                                <Select {...getFieldProps('status', {initialValue: ''})}>
                                    <Option value="">全部</Option>
                                    <Option value="1">待归档</Option>
                                    <Option value="2">已归档</Option>
                                </Select>
                            </FormItem>

                            <FormItem label="患者姓名：">
                                <Input type="text" {...getFieldProps('patientRealName', {initialValue: ''})} />
                            </FormItem>

                            <FormItem label="用户姓名：">
                                <Input type="text" {...getFieldProps('userName', {initialValue: ''})}  />
                            </FormItem>

                            <FormItem label="问诊时间：">
                                <RangePicker {...getFieldProps('callTime', {initialValue: ''})}
                                    showTime format="yyyy-MM-dd HH:mm:ss"/>
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
        cases: statStore.cases,
        department: statStore.department,
        hospital: statStore.hospital,
        doctor: statStore.doctor,
        caseConditions: statStore.caseConditions
    };
};
Case = Form.create()(Case);


export default withRouter(connect(mapStateToProps)(Case));
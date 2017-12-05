import React from 'react';
import {Table, Form, Input, Select, Button, message, Modal} from 'antd';
import styles from './index.less';

import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import {
    getConditionDoctorList,
    getHospitalList,
    getDepartmentList,
    setCurrentDoctor,//查询条件保存到状态树
    exportConditionDoctorList,//导出列表
    postOperateAccount, //停用启动账号
    postResetPwd //重置密码
} from 'redux/actions/manage';

const FormItem = Form.Item;
const Option = Select.Option;

class Manage extends React.Component {


    columns = [
        {
            title: '编号',
            dataIndex: 'id',
            width: '8%'
        },
        {
            title: '姓名',
            dataIndex: 'realname',
            width: '8%'
        },
        {
            title: '科室',
            dataIndex: 'department',
            width: '8%'
        },
        {
            title: '所属医院',
            dataIndex: 'hospital',
            width: '9%'
        },
        {
            title: '联系电话',
            dataIndex: 'mobilephone',
            width: '10%'
        },
        {
            title: '邀请码',
            dataIndex: 'identitynumber',
            width: '24%'
        },
        {
            title: '操作',
            dataIndex: 'isenable',
            width: '15%',
            render: (text, record)=> {
                return (<span><a href="javascript:;"
                                 onClick={()=>this.operateAccount(text,record)}>{text === 0 ? "停用账号" : "启用账号"}</a>
                    <span className="ant-divider"/>
                    <a href="javascript:;" onClick={()=>this.resetPwd(record)}>重置密码</a>
                    <span className="ant-divider"/>
                    <a href="javascript:;" onClick={()=>this.addDoctor(record)}>修改信息</a></span>);
            }
        }
    ];

    state = {
        loading: false,
        exportConditions: {},
        visible: false,
        currentName: '',
        isAccount: true,
        status: true
    };

    conditions = {};
    account = {};

    /*显示弹出层*/
    showModal() {
        this.setState({
            visible: true
        });
    }

    //停用启动账号
    operateAccount(text, record) {
        let status = text === 0 ? 1 : 0;
        this.account = {
            id: record.id,
            isenable: status
        };
        this.state.currentName = record.realname;
        this.state.isAccount = true;
        this.state.status = text === 0 ? true : false;

        this.showModal();
    }


    //重置密码
    resetPwd(record) {
        this.account = {
            id: record.id
        };
        this.state.currentName = record.realname;
        this.state.isAccount = false;

        this.showModal();
    }

    /*点击取消关闭弹出层*/
    handleCancel() {
        this.setState({
            visible: false
        });
    }

    //点击确定按钮提交操作
    Ok() {
        const {dispatch} = this.props;
        this.setState({
            loading: true
        });

        if (this.state.isAccount) {
            dispatch(postOperateAccount(this.account)).then((action)=> {
                let result = (action.response || {}).result;
                if (result === 0) {
                    message.success('操作成功！');
                    this.fetch();
                } else {
                    message.error('操作失败！');

                }
                this.setState({
                    visible: false
                })

            })
        } else {
            dispatch(postResetPwd(this.account)).then((action)=> {
                let result = (action.response || {}).result;
                if (result === 0) {
                    message.success('操作成功！');
                } else {
                    message.error('操作失败！');
                }
                this.setState({
                    visible: false
                })
            })
        }

        this.setState({
            loading: false
        });

    }

    //分页
    handleTableChange(pagination, filters, sorter) {
        this.conditions = Object.assign(this.conditions, {
            size: pagination.pageSize,
            curr: pagination.current
        });

        this.fetch();
    }

    //格式化请求参数格式
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

    //发送请求
    fetch() {
        const {dispatch} = this.props;

        this.conditions = Object.assign(this.conditions, this.props.form.getFieldsValue());
        this.state.exportConditions = Object.assign({}, this.conditions);

        dispatch(setCurrentDoctor({
            doctorConditions: this.conditions
        }));

        let paramsStr = this.formatConditions();
        this.setState({loading: true});
        dispatch(getConditionDoctorList(paramsStr)).then(
            ()=> {
                this.changeState(false);
            },
            ()=> {
                this.changeState(false);
            }
        );

    }

    //页面初始化操作，初始化页面
    componentDidMount() {
        this._isMounted = true;

        const {dispatch} = this.props;
        dispatch(getHospitalList());
        dispatch(getDepartmentList());

        this.init();
        this.fetch();
    }

    //表单赋值
    init() {
        const {doctorConditions={}, form}=this.props;
        this.conditions = Object.assign(this.conditions, {
            size: doctorConditions.size,
            curr: doctorConditions.curr
        });
        form.setFieldsValue({
            realname: doctorConditions.realname,
            hospitalId: doctorConditions.hospitalId,
            departmentId: doctorConditions.departmentId
        })
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
        exportConditionDoctorList(this.state.exportConditions)
    }

    //添加医生功能
    addDoctor(record) {
        const {router} =this.props;
        if (record.id) {
            router.push(`/manage/doctor/edit/${record.id}`);
        } else {
            router.push(`/manage/doctor/edit`);
        }
    }


    render() {
        const {doctors, department=[], hospital=[], doctorConditions={}} = this.props;
        const {getFieldProps} = this.props.form;

        const {currentName, isAccount, status} = this.state;

        let {data, pagination} = doctors;
        pagination.current = doctorConditions.curr;

        //医院列表
        let hospitalList = hospital.map((item, index)=> {
            return (<Option key={index} value={item.id}>{item.hospitalName}</Option>);
        });

        //科室列表
        let departmentList = department.map((item, index)=> {
            return (<Option key={index} value={item.id}>{item.departmentName}</Option>);
        });

        return (
            <div>
                <div className="panel">
                    <div className={styles.panelHead}>

                        <Form className={styles.search} inline onSubmit={this.handleSubmit}>
                            <FormItem>
                                <Button type="primary" onClick={::this.addDoctor}>添加医生</Button>
                            </FormItem>
                            <FormItem label="关键字：">
                                <Input type="text" {...getFieldProps('realname', {initialValue: ''})}
                                       placeholder="医生名"/>
                            </FormItem>
                            <FormItem label="选择医院：">
                                <Select {...getFieldProps('hospitalId', {initialValue: ''})}>
                                    <Option value="">所有医院</Option>
                                    {hospitalList}
                                </Select>
                            </FormItem>
                            <FormItem label="选择科室：">
                                <Select {...getFieldProps('departmentId', {initialValue: ''})}>
                                    <Option value="">所有科室</Option>
                                    {departmentList}
                                </Select>
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

                <div className={styles.action}>
                    <Modal wrapClassName={styles.safeModal} title="账号管理"
                           visible={this.state.visible} maskClosable={false}
                           onCancel={()=>this.handleCancel()}
                           footer={[
                            <Button key={1} type="ghost" size="large" onClick={()=>this.handleCancel()}>取  消</Button>,
                            <Button key={2} type="primary" size="large" onClick={()=>this.Ok()}>确  认</Button>
                          ]}>
                        <div className="row">
                            <div className="col">
                                {
                                    isAccount ? (status ? (<div><p>您要停用<span> {currentName} </span>医生的帐号？</p>
                                        < p > 停用帐号后医生将不再能登录和问诊，确认要停用帐号么？</p></div>) : (
                                        <p>您要启用<span> {currentName} </span>医生的帐号？</p>)) : (
                                        <p>您要重置<span> {currentName} </span>医生的登录密码？</p>)
                                }

                            </div>
                        </div>
                    </Modal>
                </div>

            </div>
        );
    }
}

const mapStateToProps = (globalStore) => {
    const {manageStore}  = globalStore;
    return {
        doctors: manageStore.doctors,
        department: manageStore.department,
        hospital: manageStore.hospital,
        doctorConditions: manageStore.doctorConditions
    };
};
Manage = Form.create()(Manage);


export default withRouter(connect(mapStateToProps)(Manage));
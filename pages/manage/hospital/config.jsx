import React from 'react';
import {Table, Form, Button, message, Modal} from 'antd';
import styles from './index.less';

import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import {
    getConditionHospitalList,
    postDeleteHospital

} from 'redux/actions/manage';

const FormItem = Form.Item;

class Config extends React.Component {


    columns = [
        {
            title: '医院名称',
            dataIndex: 'hospitalName',
            width: '15%'
        },
        {
            title: '添加时间',
            dataIndex: 'createdTimeStr',
            width: '15%'
        },
        {
            title: '服务时间',
            dataIndex: 'workTimeName',
            width: '15%'
        },
        {
            title: '管理员',
            dataIndex: 'systemUserName',
            width: '25%'
        },
        {
            title: '操作',
            dataIndex: 'isenable',
            width: '25%',
            render: (text,record)=> {
                return (<span><a href="javascript:;"
                                 onClick={()=>this.management(record)}>定制管理权限</a>
                    <span className="ant-divider"/>
                    <a href="javascript:;" onClick={()=>this.addHospital(record)}>修改医院</a>
                    <span className="ant-divider"/>
                    <a href="javascript:;" onClick={()=>this.reomveHospital(record)}>删除医院</a></span>);
            }
        }
    ];

    state = {
        loading: false,
        hospitalName: '',
        visible: false
    };

    conditions = {
        size: 10,
        curr: 1
    };

    account = {};

    //点击定制管理权限按钮
    management(record) {
        let params = {
            departmentCode: record.departmentCode,
            companyCode: record.companyCode,
            hospitalName: record.hospitalName
        };

        let list = [];
        for (let key in params) {
            if (params[key]) {
                list.push(key + '=' + params[key]);
            }
        }

        const {router} =this.props;
        router.push(`/manage/hospital/permission?${list.join('&')}`);

    }

    //添加医生功能
    addHospital(record) {
        const {router} =this.props;
        if (record.id) {
            router.push(`/manage/hospital/edit/${record.id}`);
        } else {
            router.push(`/manage/hospital/edit`);
        }
    }

    /*点击取消关闭弹出层*/
    handleCancel() {
        this.setState({
            visible: false
        });
    }

    //点击确定按钮提交操作
    Ok() {
        this.setState({
            loading: true
        });

        const {dispatch} = this.props;

        dispatch(postDeleteHospital(this.account)).then((action)=> {
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
        });

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


    //发送请求
    fetch() {
        const {dispatch} = this.props;

        let paramsStr = this.formatConditions();
        this.setState({loading: true});
        dispatch(getConditionHospitalList(paramsStr)).then(
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

        this.fetch();
    }


    componentWillUnmount() {
        this._isMounted = false;
    }

    changeState(flag) {
        if (this._isMounted) {
            this.setState({loading: flag});
        }
    }


    //添加医生功能
    addHospital(record) {
        const {router} =this.props;
        if (record.id) {
            router.push(`/manage/hospital/edit/${record.id}`);
        } else {
            router.push(`/manage/hospital/edit`);
        }
    }


    render() {
        const {hospitals} = this.props;
        const {hospitalName} = this.state;

        let {data} = hospitals;

        return (
            <div>
                <div className="panel">
                    <div className={styles.panelHead}>
                        <FormItem>
                            <Button type="primary" onClick={::this.addHospital}>添加医院</Button>
                        </FormItem>
                    </div>
                    <div className={styles.panelBody}>
                        <Table
                            rowKey={(record, index)=>{return record.key}}
                            columns={this.columns}
                            dataSource={data}
                            loading={this.state.loading}
                            onChange={::this.handleTableChange}
                            locale={{emptyText:'没有符合条件的内容'}}
                            bordered/>
                    </div>
                </div>

                <div className={styles.action}>
                    <Modal wrapClassName={styles.safeModal} title="删除医院"
                           visible={this.state.visible} maskClosable={false}
                           onCancel={()=>this.handleCancel()}
                           footer={[
                            <Button key={1} type="ghost" size="large" onClick={()=>this.handleCancel()}>取  消</Button>,
                            <Button key={2} type="primary" size="large" onClick={()=>this.Ok()}>确  认</Button>
                          ]}>
                        <div className="row">
                            <div className="col">
                                <p>您要删除<span> {hospitalName} </span>吗？</p>
                                <p>医院删除后不可再恢复，用户不会再被推荐该医院的医生，该医院医生也无法再出诊。请确认不影响已售卖服务。</p>
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
        hospitals: manageStore.hospitals
    };
};
Config = Form.create()(Config);


export default withRouter(connect(mapStateToProps)(Config));
import React from 'react';
import {Table, Form, Button, message, Modal} from 'antd';
import styles from './index.less';

import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import {
    postManageHospital

} from 'redux/actions/manage';

const FormItem = Form.Item;

class Permission extends React.Component {


    columns = [
        {
            title: '管理员',
            dataIndex: 'realName',
            width: '10%'
        },
        {
            title: '添加时间',
            dataIndex: 'createdTimeStr',
            width: '10%'
        },
        {
            title: '邮箱',
            dataIndex: 'email',
            width: '15%'
        },
        {
            title: '角色',
            dataIndex: 'authRoleList',
            width: '15%',
            render: (text, record)=> {
                let roleList = text.map((item,index)=>{
                    return (<a href="javascript:;" onClick={()=>this.addAdmin(item.roleCode)}>{item.roleName}</a>);
                });
            }
        },
        {
            title: '状态',
            dataIndex: 'isEnable',
            width: '10%',
            render: (text)=> {

                return text;
            }
        },
        {
            title: '操作',
            dataIndex: 'isenable',
            width: '25%',
            render: (text, record)=> {
                return (<span><a href="javascript:;"
                                 onClick={()=>this.operate(text,record)}>禁用</a>
                    <span className="ant-divider"/>
                    <a href="javascript:;" onClick={()=>this.resetPwd(record)}>重置密码</a>
                    <span className="ant-divider"/>
                    <a href="javascript:;" onClick={()=>this.addAdmin(record)}>修改信息</a></span>);
            }
        }
    ];

    state = {
        loading: false,
        visible: false
    };

    conditions = {
        size: 10,
        curr: 1
    };

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

    //发送请求
    fetch() {
        const {dispatch} = this.props;

        this.setState({loading: true});
        dispatch(postManageHospital(this.conditions)).then(
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

        const {location} = this.props;
        let param = location.query;
        this.conditions = Object.assign(this.conditions,
            param);

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
    addAdmin(record) {
        const {router} =this.props;
        if (record.id) {
            router.push(`/manage/hospital/edit/${record.id}`);
        } else {
            router.push(`/manage/hospital/edit`);
        }
    }


    render() {
        const {admins} = this.props;

        let {data} = admins;

        return (
            <div>
                <div className="panel">
                    <div className={styles.panelHead}>
                        <FormItem>
                            <Button type="primary" onClick={::this.addAdmin}>新增管理员</Button>
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
                                <p>您要删除<span></span>吗？</p>
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
        admins: manageStore.admins
    };
};
Permission = Form.create()(Permission);


export default withRouter(connect(mapStateToProps)(Permission));
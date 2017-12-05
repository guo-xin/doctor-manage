import React from 'react';
import {Form, Input, Select, Button, message, Checkbox} from 'antd';
import styles from './addHospital.less';

import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import {
    postEditHospitalContent,
    postSaveHospital

} from 'redux/actions/manage';

const FormItem = Form.Item;
const Option = Select.Option;


class AddHospital extends React.Component {

    state = {
        loading: false
    };

    //是否是编辑状态
    isEdit = false;

    //修改医院初始化条件
    conditions = {}

    //页面初始化操作，初始化页面
    componentDidMount() {
        const {dispatch, params, form} = this.props;

        if (params.id || params.id === 0) {
            this.isEdit = true;
        }

        if (this.isEdit) {
            dispatch(postEditHospitalContent(params)).then((action)=> {
                let data = (action.response || {}).data;

                this.conditions = {
                    id: data.id,
                    isEnable: data.isEnable,
                    departmentCode: data.departmentCode,
                    companyCode:data.companyCode,
                    createdTime: data.createdTimeStr
                };


                form.setFieldsValue({
                    hospitalName: data.hospitalName,
                    workTime: data.workTime + '',
                    address: data.address
                });

            });
        }
    }

    /*确认按钮*/
    onOK() {
        const {dispatch, form, params} = this.props;

        this.props.form.validateFields((errors, values) => {
            if (!!errors) {
                return;
            } else {
                this.setState({
                    loading: true
                });

                let hide = message.loading('正在保存...', 0);

                let {
                    hospitalName,
                    workTime,
                    provinceCode,
                    cityCode,
                    districtCode,
                    address
                } = form.getFieldsValue();

                let param = {
                    hospitalName,
                    workTime,
                    provinceCode,
                    cityCode,
                    districtCode,
                    address
                };

                if (this.isEdit) {
                    //将初始化条件添加到条件中
                    this.conditions = Object.assign(this.conditions, {
                        param
                    })

                } else {
                    console.log(param, form.getFieldValue('isCode'));
                    let isCode = form.getFieldValue('isCode') ? 1 : 0;
                    param.isCode = isCode;
                }

                dispatch(postSaveHospital(param)).then(()=> {
                    if (this.props.result === 0) {
                        hide();
                        message.success('更改成功！');
                        this.props.router.replace('/manage/doctor');
                    }
                }, () => {
                    hide();
                    message.error('请求失败！');
                });

                this.setState({
                    loading: false
                });
            }
        });
    }

    /*取消按钮*/
    onCancel() {
        this.props.router.replace('/manage/hospital');
    }


    render() {
        const {getFieldProps, getFieldValue} = this.props.form;


        return (
            <div className={styles.wrapper}>
                <Form form={this.props.form}>
                    <div className={styles.panelBody}>
                        <div className="row">
                            <div className="col">
                                <FormItem label="医院名称：">
                                    <Input {...getFieldProps('hospitalName', {
                                        rules: [
                                            {
                                                required: true,
                                                whitespace: true,
                                                message: '请填写医院名称'
                                            }
                                        ]
                                    })} type="text"/>
                                </FormItem>
                            </div>
                            <div className="col">
                                <FormItem label="服务时间：">
                                    <Select {...getFieldProps('workTime', {
                                        initialValue: '',
                                        rules: [
                                            {
                                                required: true,
                                                whitespace: true,
                                                message: '请选择服务时间'
                                            }
                                        ]
                                    })} >
                                        <Option value="">请选择服务时间</Option>
                                        <Option value="1">8小时x5天</Option>
                                        <Option value="2">12小时x5天</Option>
                                        <Option value="3">12小时x7天</Option>
                                        <Option value="4">24小时x7天</Option>
                                    </Select>
                                </FormItem>
                            </div>
                            <div className="col">
                                <FormItem label="所属地区：">
                                    <Input {...getFieldProps('provinceCode', {
                                        rules: [
                                            {
                                                required: true,
                                                whitespace: true,
                                                message: '请填写所属地区'
                                            }
                                        ]
                                    })} type="text"/>
                                </FormItem>
                            </div>
                            <div className="col">
                                <FormItem label="详细地址：">
                                    <Input {...getFieldProps('address', {
                                        rules: [
                                            {
                                                required: true,
                                                whitespace: true,
                                                message: '请填写详细地址'
                                            }
                                        ]
                                    })} type="text"/>
                                </FormItem>
                            </div>
                            {!this.isEdit ? (<div className="col">
                                <FormItem label="">
                                    <Checkbox {...getFieldProps('isCode')}>使用医院邀请码代替医生个人邀请码</Checkbox>
                                </FormItem>
                            </div>) : ''}
                        </div>
                    </div>

                    <div className={styles.action}>
                        <Button type="primary" size="large" onClick={(e)=>this.onOK(e)}>确定</Button>
                        <Button type="ghost" size="large" onClick={()=>this.onCancel()}>取消</Button>
                    </div>
                </Form>
            </div >
        );
    }
}

const mapStateToProps = (globalStore) => {
    const {manageStore}  = globalStore;
    return {
        result: manageStore.result
    };
};
AddHospital = Form.create()(AddHospital);


export default withRouter(connect(mapStateToProps)(AddHospital));
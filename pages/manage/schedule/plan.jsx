import React from 'react';
import {Tabs, Form, Input, Select, Button, message, Modal, DatePicker} from 'antd';
import styles from './index.less';

import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import {
    postScheduleList,
    postScheduleChoseConditions
} from 'redux/actions/manage';

import * as global from 'util/global';

const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;

class Plan extends React.Component {

    //查询排班的条件,时间默认为今天
    conditions = {
        workday: global.formatYear(new Date())
    };

    //页面初始化操作，初始化页面
    componentDidMount() {
        const {dispatch, form} = this.props;
        dispatch(postScheduleList());

        form.setFieldsValue({
            workday: global.formatDate(new Date(), "yyyy-MM-dd")
        });
    }

    //选择医院请求操作
    onHospitalChange(val) {
        const {dispatch, form} = this.props;

        this.conditions = Object.assign(this.conditions, {
            workday: global.formatYear(new Date()),
            hospitalId: val.split("&")[0],
            worktime: val.split("&")[1]
        });
        form.setFieldsValue({
            workday: global.formatDate(new Date(), "yyyy-MM-dd")
        });

        let paramsStr = this.formatConditions(this.conditions);
        dispatch(postScheduleChoseConditions(paramsStr));

        console.log(this.conditions)
    }

    //选择排班上时间请求操作
    onChangeTime(tab,key) {
        console.log(tab)

        //onDatePickerChange()
    }

    //选择时间控件时间请求操作
    onDatePickerChange(date) {
        this.conditions = Object.assign(this.conditions, {
            workday: global.formatYear(date)
        });

        if (this.conditions.hospitalId || this.conditions.hospitalId === 0) {
            let paramsStr = this.formatConditions(this.conditions);
            const {dispatch} = this.props;

            dispatch(postScheduleChoseConditions(paramsStr));
        }

        console.log(this.conditions)
    }

    //格式化请求参数
    formatConditions(val) {
        let list = [];
        let cons = val;

        for (let key in cons) {
            if (cons[key]) {
                list.push(key + '=' + cons[key]);
            }
        }

        return list.join('&');
    }

    render() {
        const {hospital={}, information={}} = this.props;
        const {getFieldProps} = this.props.form;

        let {hospitalList =[]} = hospital;

        //医院列表
        let hospitalLists = hospitalList.map((item, index)=> {
            return (<Option key={index} value={item.id+'&'+item.workTime+''}>{item.hospitalName} {item.workTimeName}</Option>);
        });


        return (
            <div className={styles.plan}>

                <div className={styles.top}>
                    <Form form={this.props.form}>
                        <div className="row">
                            <div className={styles.left}>
                                <FormItem>
                                    <Select {...getFieldProps('hospitalId', {
                                        initialValue: '',
                                        onChange: (val)=>this.onHospitalChange(val),
                                        rules: [
                                            {
                                                required: true,
                                                whitespace: true,
                                                message: '请选择排班医院'
                                            }
                                        ]
                                    })} >
                                        <Option value="">请选择排班医院</Option>
                                        {hospitalLists}
                                    </Select>
                                </FormItem>
                            </div>
                            <div className={styles.right}>
                                <FormItem>
                                    <DatePicker {...getFieldProps('workday', {onChange: (val)=>this.onDatePickerChange(val)})}
                                        size="large"/>
                                </FormItem>
                            </div>
                        </div>

                    </Form>
                </div>

                <div className={styles.bottom}>

                    <Tabs onChange={this.onChangeTime} type="card">
                        <TabPane tab="下午13:00-17:00 0" key="1">
                            <span>选项卡一选项卡一内容内容选项卡一选项卡一内容选项卡一选项卡一内容内容内容选项卡一选项卡一内容内容选项卡一选项卡一内容内容选项卡一选项卡一内容内容</span>
                        </TabPane>
                        <TabPane tab="下午13:00-17:00 0" key="2">
                            <span>选项卡一选项卡一内内容选项卡一选项卡一内容内容选项卡一选项卡一内容内容</span>
                        </TabPane>
                        <TabPane tab="下午13:00-17:00 0" key="3">
                            <span>选项卡一选项aaaaaaa选项卡一内容内容选项卡一选项卡一内容内容选项卡一选项卡一内容内容</span>
                        </TabPane>
                        <TabPane tab="下午13:00-17:00 0" key="4">
                            <span>选项卡一选项卡一内容内容选项卡3433443容内容选项卡一选项卡一内容内容</span>
                        </TabPane>
                        <TabPane tab="下午13:00-17:00 0" key="5">
                            <span>选项卡一选项卡一内容内容选项卡一选项卡一内容选项卡一选项卡一内容内容内容选项卡一选项卡一内容内容选项卡一选项卡一内容内容选项卡一选项卡一内容内容</span>
                        </TabPane>
                        <TabPane tab="下午13:00-17:00 0" key="6">
                            <span>选项卡一选项卡一内容内容选项卡一选项卡一容内容选项卡一选项卡一内容内容选项卡一选项卡一内容内容选项卡一选项卡一内容内容</span>
                        </TabPane>
                        <TabPane tab="下午13:00-17:00 15" key="7">
                            <span>选项卡一选项卡一内容内容维吾尔内容内容内容内容</span>
                        </TabPane>
                    </Tabs>
                </div>

            </div>
        );
    }
}

const mapStateToProps = (globalStore) => {
    const {manageStore}  = globalStore;
    return {
        hospital: manageStore.hospitalList,
        information: manageStore.information

    };
};
Plan = Form.create()(Plan);


export default withRouter(connect(mapStateToProps)(Plan));
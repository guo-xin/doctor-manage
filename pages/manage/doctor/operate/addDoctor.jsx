import React from 'react';
import {Upload, Icon, Table, Form, Input, Select, Button, message} from 'antd';
import styles from './addDoctor.less';

import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import {
    getAddDoctorContent,
    postEditDoctorContent,
    postAddDoctor,
    postEditDoctor,
    postCheckEmailIdentity,
    postEditEmailIdentity
} from 'redux/actions/manage';

import * as global from 'util/global';
const FormItem = Form.Item;
const Option = Select.Option;
const Dragger = Upload.Dragger;


//验证身份证号码
function checkIDCard(card) {
    var city = {
        11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古",
        21: "辽宁", 22: "吉林", 23: "黑龙江", 31: "上海", 32: "江苏",
        33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南",
        42: "湖北", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆",
        51: "四川", 52: "贵州", 53: "云南", 54: "西藏", 61: "陕西", 62: "甘肃",
        63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外"
    };

    //检查号码是否符合规范，包括长度，类型
    var isCardNo = function (card) {
        //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X  
        var reg = /(^\d{15}$)|(^\d{17}(\d|X)$)/;
        if (reg.test(card) === false) {
            return false;
        }

        return true;
    };

    //取身份证前两位,校验省份
    var checkProvince = function (card) {
        var province = card.substr(0, 2);
        if (city[province] == undefined) {
            return false;
        }
        return true;
    };

    //检查生日是否正确
    var checkBirthday = function (card) {
        var len = card.length;
        //身份证15位时，次序为省（3位）市（3位）年（2位）月（2位）日（2位）校验位（3位），皆为数字  
        if (len == '15') {
            var re_fifteen = /^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/;
            var arr_data = card.match(re_fifteen);
            var year = arr_data[2];
            var month = arr_data[3];
            var day = arr_data[4];
            var birthday = new Date('19' + year + '/' + month + '/' + day);
            return verifyBirthday('19' + year, month, day, birthday);
        }
        //身份证18位时，次序为省（3位）市（3位）年（4位）月（2位）日（2位）校验位（4位），校验位末尾可能为X  
        if (len == '18') {
            var re_eighteen = /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/;
            var arr_data = card.match(re_eighteen);
            var year = arr_data[2];
            var month = arr_data[3];
            var day = arr_data[4];
            var birthday = new Date(year + '/' + month + '/' + day);
            return verifyBirthday(year, month, day, birthday);
        }
        return false;
    };

    //校验日期
    var verifyBirthday = function (year, month, day, birthday) {
        var now = new Date();
        var now_year = now.getFullYear();
        //年月日是否合理  
        if (birthday.getFullYear() == year && (birthday.getMonth() + 1) == month && birthday.getDate() == day) {
            //判断年份的范围（3岁到100岁之间)  
            var time = now_year - year;
            if (time >= 3 && time <= 100) {
                return true;
            }
            return false;
        }
        return false;
    };

    //校验位的检测
    var checkParity = function (card) {
        //15位转18位  
        card = changeFivteenToEighteen(card);
        var len = card.length;
        if (len == '18') {
            var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
            var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
            var cardTemp = 0, i, valnum;
            for (i = 0; i < 17; i++) {
                cardTemp += card.substr(i, 1) * arrInt[i];
            }
            valnum = arrCh[cardTemp % 11];
            if (valnum == card.substr(17, 1)) {
                return true;
            }
            return false;
        }
        return false;
    };

    //15位转18位身份证号  
    var changeFivteenToEighteen = function (card) {
        if (card.length == '15') {
            var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
            var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
            var cardTemp = 0, i;
            card = card.substr(0, 6) + '19' + card.substr(6, card.length - 6);
            for (i = 0; i < 17; i++) {
                cardTemp += card.substr(i, 1) * arrInt[i];
            }
            card += arrCh[cardTemp % 11];
            return card;
        }
        return card;
    };

    //是否为空
    if (card === '' || card === null || card === undefined) {
        return true;
    }
    //校验长度，类型
    if (isCardNo(card) === false) {
        return false;
    }
    //检查省份
    if (checkProvince(card) === false) {
        return false;
    }
    //校验生日
    if (checkBirthday(card) === false) {
        return false;
    }
    //检验位的检测
    if (checkParity(card) === false) {
        return false;
    }

    return true;
}

class AddDoctor extends React.Component {

    state = {
        loading: false,
        specialSkill: '',
        introduction: '',
        fileList: []
    };

    //添加医生,编辑医生之前验证邮箱，身份证是否已经注册
    sendIdentity = null;
    sendEmail = null;
    //是否是编辑状态
    isEdit = false;

    //页面初始化操作，初始化页面
    componentDidMount() {
        const {dispatch, params, form} = this.props;

        if (params.id || params.id === 0) {
            this.isEdit = true;
        }

        if (this.isEdit) {
            dispatch(postEditDoctorContent(params)).then((action)=> {
                let data = (action.response || {}).data;
                let doc = data.doc;

                form.setFieldsValue({
                    email: doc.email,
                    realname: doc.realname,
                    departmentId: doc.departmentId + '',
                    mobilephone: doc.mobilephone,
                    jobtitle: doc.jobtitle + '',
                    hospitalId: doc.hospitalId + '',
                    workYearsType: doc.workYearsType + '',
                    identitynumber: doc.identitynumber + '',
                    startworkyear: doc.startworkyear+'',
                    jobtitlepic: doc.jobtitlepic,
                    credentialpic: doc.credentialpic,
                    headpic: doc.headpic,
                    photoshow: doc.photoshow,
                    specialSkill: doc.specialSkill,
                    introduction: doc.introduction
                });

                this.setState({
                    specialSkill: doc.specialSkill,
                    introduction: doc.introduction
                });

            });
        } else {
            dispatch(getAddDoctorContent());
        }
    }

    /*擅长字数限制*/
    onSkillChange(e) {
        if (e.target.value.length > 300) {
            this.setState({
                specialSkill: e.target.value.substring(0, 300)
            })
        } else {
            this.setState({
                specialSkill: e.target.value
            })
        }
    }

    /*简介字数限制*/
    onIntroductionChange(e) {
        if (e.target.value.length > 500) {
            this.setState({
                introduction: e.target.value.substring(0, 500)
            })
        } else {
            this.setState({
                introduction: e.target.value
            })
        }
    }

    //调用身份证验证操作
    checkID(rule, value, callback) {
        if (checkIDCard(value)) {
            clearTimeout(this.sendIdentity);
            this.sendIdentity = setTimeout(()=> {
                const {dispatch}  = this.props;
                let params = {
                    identitynumber: value
                };
                if (this.isEdit) {
                    dispatch(postEditEmailIdentity(params)).then((action)=> {
                        let result = (action.response || {}).result;
                        if (result === 0) {
                            callback();
                        } else {
                            callback('该身份证号码已注册');
                        }
                    })
                } else {
                    dispatch(postCheckEmailIdentity(params)).then((action)=> {
                        let result = (action.response || {}).result;
                        if (result === 0) {
                            callback();
                        } else {
                            callback('该身份证号码已注册');
                        }
                    })
                }
            }, 300);

        } else {
            callback('请输入正确的身份证号码');
        }
    }


    //邮箱改变时验证邮箱是否已经注册
    onEmailChange(rule, value, callback) {
        if (/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/.test(value)) {
            clearTimeout(this.sendEmail);
            this.sendEmail = setTimeout(()=> {
                const {dispatch} = this.props;
                let params = {
                    email: value
                };
                if (this.isEdit) {
                    dispatch(postEditEmailIdentity(params)).then((action)=> {
                        let result = (action.response || {}).result;
                        if (result === 0) {
                            callback();
                        } else {
                            callback('该邮箱已注册');
                        }
                    })
                } else {
                    dispatch(postCheckEmailIdentity(params)).then((action)=> {
                        let result = (action.response || {}).result;
                        if (result === 0) {
                            callback();
                        } else {
                            callback('该邮箱已注册');
                        }
                    })
                }

            }, 300);

        } else if (!value) {
            callback();
        } else {
            callback('请输入正确的邮箱地址');
        }
    }

    //签发年份的验证，是否填写
    onTimeChange(rule, value, callback) {
        if (value) {
            let check = /^\d{4}$/.test(value);
            let time = (new Date()).getFullYear();
            if (check && value > 1970 && value <= time) {
                callback();
            } else {
                callback('请输入正确年份');
            }
        } else {
            callback();
        }
    }

    /*确认按钮*/
    onOK() {
        const {dispatch, form, params} = this.props;

        let {
            email,
            realname,
            departmentId,
            mobilephone,
            jobtitle,
            startworkyear,
            hospitalId,
            workYearsType,
            identitynumber,
            jobtitlepic,
            credentialpic,
            headpic,
            photoshow,
            specialSkill,
            introduction
        } = form.getFieldsValue();

        let param = {
            email,
            realname,
            departmentId,
            mobilephone,
            jobtitle,
            startworkyear,
            hospitalId,
            workYearsType,
            identitynumber,
            jobtitlepic,
            credentialpic,
            headpic,
            photoshow,
            specialSkill,
            introduction
        };

        this.props.form.validateFields((errors, values) => {
            if (!!errors) {
                return;
            } else {
                this.setState({
                    loading: true
                });

                let hide = message.loading('正在保存...', 0);
                if (params.id || params.id === 0) {
                    param.id = params.id;

                    dispatch(postEditDoctor(param)).then(()=> {
                        if (this.props.result === 0) {
                            hide();
                            message.success('更改成功！');
                            this.props.router.replace('/manage/doctor');
                        }
                    }, () => {
                        hide();
                        message.error('请求失败！');
                    });
                } else {
                    dispatch(postAddDoctor(param)).then(()=> {
                        if (this.props.result === 0) {
                            hide();
                            message.success('更改成功！');
                            this.props.router.replace('/manage/doctor');
                        }
                    }, () => {
                        hide();
                        message.error('请求失败！');
                    });
                }

                this.setState({
                    loading: false
                });
            }
        });
    }

    /*取消按钮*/
    onCancel() {
        this.props.router.replace('/manage/doctor');
    }


    //上传方法
    onUploadChange(info, field) {
        if (info.file.status === 'error') {
            message.error(`${info.file.name} 上传失败。`);
        } else {
            let fileList = info.fileList;
            fileList = fileList.slice(-1);

            fileList = fileList.map((file) => {
                if (file.response) {
                    // 组件会将 file.url 作为链接进行展示
                    file.url = file.response.data;
                }
                return file;
            });

            // 3. 按照服务器返回信息筛选成功上传的文件
            fileList = fileList.filter((file) => {
                if (file.response) {
                    return file.response.result === 0;
                }
                return true;
            });

            if (fileList.length > 0 && fileList[0].url) {
                this.props.form.setFieldsValue({
                    [field]: fileList[0].url
                });
            }
        }

    }

    render() {
        const {content={}} = this.props;
        const {getFieldProps, getFieldValue} = this.props.form;

        //职称证书
        const jobtitlepic = {
            action: '/v2/validate/uploadImg',
            name: 'file',
            showUploadList: false,
            listType: 'picture',
            onChange: (info)=> {
                this.onUploadChange(info, 'jobtitlepic')
            }
        };

        const credentialpic = {
            action: '/v2/validate/uploadImg',
            name: 'file',
            showUploadList: false,
            listType: 'picture',
            onChange: (info)=> {
                this.onUploadChange(info, 'credentialpic')
            }
        };

        const headpic = {
            action: '/v2/validate/uploadImg',
            name: 'file',
            showUploadList: false,
            listType: 'picture',
            onChange: (info)=> {
                this.onUploadChange(info, 'headpic')
            }
        };

        const photoshow = {
            action: '/v2/validate/uploadImg',
            name: 'file',
            showUploadList: false,
            listType: 'picture',
            onChange: (info)=> {
                this.onUploadChange(info, 'photoshow')
            }
        };

        let {hospitalList=[], departmentList=[], jobtitleList=[]} = content;

        //医院列表
        let hospitalLists = hospitalList.map((item, index)=> {
            return (<Option key={index} value={item.id+''}>{item.hospitalName}</Option>);
        });

        //科室列表
        let departmentLists = departmentList.map((item, index)=> {
            return (<Option key={index} value={item.id+''}>{item.name}</Option>);
        });

        //职称列表
        let jobTitleLists = jobtitleList.map((item, index)=> {
            return (<Option key={index} value={item.code+''}>{item.name}</Option>);
        });

        //工作年限列表
        let yearLists = global.YEARS_LIST.map((item, index)=> {
            return (<Option key={item.value} value={item.value+''}>{item.text}</Option>);
        });

        return (
            <div className={styles.wrapper}>
                <Form form={this.props.form}>
                    <div className={styles.panelHead}>
                        <div className={styles.panelTitle}>账户信息:</div>
                    </div>
                    <div className={styles.panelBody}>
                        <div className="row">
                            <div className="col">
                                <FormItem label="登录邮箱：">
                                    <Input {...getFieldProps('email', {
                                        rules: [
                                            {
                                                required: true,
                                                whitespace: true,
                                                message: '请输入邮箱'
                                            },
                                            {validator: ::this.onEmailChange}
                                        ]
                                    })} type="text"/>
                                </FormItem>
                            </div>
                        </div>
                    </div>

                    <div className={styles.panelHead}>
                        <div className={styles.panelTitle}>医生基础信息:</div>
                    </div>

                    <div className={styles.panelBody}>
                        <div className="row">
                            <div className="col">
                                <FormItem label="姓名：">
                                    <Input {...getFieldProps('realname', {
                                        rules: [
                                            {
                                                required: true,
                                                whitespace: true,
                                                message: '请输入医生姓名'
                                            }
                                        ]
                                    })} type="text"/>
                                </FormItem>
                            </div>
                            <div className="col">
                                <FormItem label="科室：">
                                    <Select {...getFieldProps('departmentId', {
                                        initialValue: '',
                                        rules: [
                                            {
                                                required: true,
                                                whitespace: true,
                                                message: '请选择科室'
                                            }
                                        ]
                                    })} >
                                        <Option value="">请选择科室</Option>
                                        {departmentLists}
                                    </Select>
                                </FormItem>
                            </div>
                            <div className="col">
                                <FormItem label="手机号：">
                                    <Input {...getFieldProps('mobilephone', {
                                        rules: [
                                            {
                                                required: true,
                                                whitespace: true,
                                                message: '请输入手机号'
                                            },
                                            {
                                                pattern: /^1[3|4|5|7|8]\d{9}$/,
                                                whitespace: true,
                                                message: '您输入的不是有效手机号'
                                            }
                                        ]
                                    })} type="text"/>
                                </FormItem>
                            </div>
                            <div className="col">
                                <FormItem label="身份证：">
                                    <Input {...getFieldProps('identitynumber', {
                                        rules: [
                                            {
                                                required: true,
                                                whitespace: true,
                                                message: '请输入身份证号'
                                            },
                                            {validator: ::this.checkID}
                                        ]
                                    })} type="text"/>
                                </FormItem>
                            </div>
                            <div className="col">
                                <FormItem label="职称：">
                                    <Select {...getFieldProps('jobtitle', {
                                        initialValue: '',
                                        rules: [
                                            {
                                                required: true,
                                                whitespace: true,
                                                message: '请选择职称'
                                            }
                                        ]
                                    })}>
                                        <Option value="">请选择职称</Option>
                                        {jobTitleLists}
                                    </Select>
                                </FormItem>
                            </div>
                            <div className="col">
                                <FormItem label="签发年份：">
                                    <Input {...getFieldProps('startworkyear', {
                                        rules: [
                                            {
                                                required: true,
                                                whitespace: true,
                                                message: '请输入年份'
                                            },
                                            {validator: ::this.onTimeChange}
                                        ]
                                    })} type="text"/>
                                </FormItem>
                            </div>
                            <div className="col">
                                <FormItem label="所属医院：">
                                    <Select {...getFieldProps('hospitalId', {
                                        initialValue: '',
                                        rules: [
                                            {
                                                required: true,
                                                whitespace: true,
                                                message: '请选择所属医院'
                                            }
                                        ]
                                    })}>
                                        <Option value="">请选择所属医院</Option>
                                        {hospitalLists}
                                    </Select>
                                </FormItem>
                            </div>
                            <div className="col">
                                <FormItem label="工作年限：">
                                    <Select {...getFieldProps('workYearsType', {
                                        initialValue: '',
                                        rules: [
                                            {
                                                required: true,
                                                whitespace: true,
                                                message: '请选择工作年限'
                                            }
                                        ]
                                    })}>
                                        <Option value="">请选择工作年限</Option>
                                        {yearLists}
                                    </Select>
                                </FormItem>
                            </div>
                            <div className="col">
                                <FormItem label="职称证书：">
                                    <Input className="upload" {...getFieldProps('jobtitlepic',
                                        {
                                            rules: [
                                                {
                                                    required: true,
                                                    whitespace: true,
                                                    message: '请选择职称证书'
                                                }
                                            ]
                                        })} type="text"/>
                                    <div style={{ width: 246, height: 140 }}>
                                        <Dragger {...jobtitlepic}>
                                            {getFieldValue('jobtitlepic') ? (
                                                <img src={getFieldValue('jobtitlepic')} style={{height:140}}/>) : (
                                                <Icon type="plus"/>)}
                                        </Dragger>
                                    </div>
                                </FormItem>
                            </div>
                            <div className="col">
                                <FormItem label="执业证书：">
                                    <Input className="upload" {...getFieldProps('credentialpic', {
                                        rules: [
                                            {
                                                required: true,
                                                whitespace: true,
                                                message: '请选择职称证书'
                                            }
                                        ]
                                    })} type="text"/>
                                    <div style={{ width: 246, height: 140 }}>
                                        <Dragger {...credentialpic}>
                                            {getFieldValue('credentialpic') ? (
                                                <img src={getFieldValue('credentialpic')} style={{height:140}}/>) : (
                                                <Icon type="plus"/>)}
                                        </Dragger>
                                    </div>
                                </FormItem>
                            </div>

                            <div className="col">
                                <FormItem label="医生头像680x680：">
                                    <Input className="upload" {...getFieldProps('headpic', {
                                        rules: [
                                            {
                                                required: true,
                                                whitespace: true,
                                                message: '请选择医生头像'
                                            }
                                        ]
                                    })} type="text"/>
                                    <div style={{ width: 246, height: 140 }}>
                                        <Dragger {...headpic}>
                                            {getFieldValue('headpic') ? (
                                                <img src={getFieldValue('headpic')} style={{height:140}}/>) : (
                                                <Icon type="plus"/>)}
                                        </Dragger>

                                    </div>
                                </FormItem>
                            </div>
                            <div className="col">
                                <FormItem label="欢迎图片1000x1600：">
                                    <Input className="upload" {...getFieldProps('photoshow', {
                                        rules: [
                                            {
                                                required: true,
                                                whitespace: true,
                                                message: '请选择欢迎图片'
                                            }
                                        ]
                                    })} type="text"/>
                                    <div style={{ width: 246, height: 140 }}>
                                        <Dragger {...photoshow}>
                                            {getFieldValue('photoshow') ? (
                                                <img src={getFieldValue('photoshow')} style={{height:140}}/>) : (
                                                <Icon type="plus"/>)}
                                        </Dragger>
                                    </div>
                                </FormItem>
                            </div>
                        </div>
                    </div>
                    <div className={styles.panelHead}>
                        <div className={styles.panelTitle}>个人说明</div>
                    </div>
                    <div className={styles.panelBody}>
                        <div className={styles.textarea + " row"}>
                            <FormItem label="擅长">
                                <Input type="textarea" rows="5" value={this.state.specialSkill}
                                    {...getFieldProps('specialSkill', {
                                        onChange: (e)=>this.onSkillChange(e),
                                        rules: [
                                            {
                                                required: true,
                                                whitespace: true,
                                                message: '请填写医生擅长'
                                            }
                                        ]
                                    })}/>
                                <div className={styles.wordTip}>
                                    <span>{300 - (this.state.specialSkill ? this.state.specialSkill.length : 0)}</span><span>/300</span>
                                </div>
                            </FormItem>
                        </div>
                    </div>

                    <div className={styles.panelBody}>
                        <div className={styles.textarea + " row"}>
                            <FormItem label="简介">
                                <Input type="textarea" rows="5" value={this.state.introduction}
                                    {...getFieldProps('introduction', {
                                        onChange: (e)=>this.onIntroductionChange(e),
                                        rules: [
                                            {
                                                required: true,
                                                whitespace: true,
                                                message: '请填写医生简介'
                                            }
                                        ]
                                    })}/>
                                <div className={styles.wordTip}>
                                    <span>{500 - (this.state.introduction ? this.state.introduction.length : 0)}</span><span>/500</span>
                                </div>
                            </FormItem>
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
        content: manageStore.content,
        result: manageStore.result
    };
};
AddDoctor = Form.create()(AddDoctor);


export default withRouter(connect(mapStateToProps)(AddDoctor));
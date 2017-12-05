import * as actions from './actions';
import fetch from 'isomorphic-fetch';

//保存当前医生列表条件信息到状态树
export const setCurrentDoctor = actions.create(actions.SET_CURRENT_DOCTOR, 'data');


//附件导出功能
function exportData(url, conditions={}) {
    // 创建一个 form
    var formForExport = document.createElement("form");
    formForExport.id = "formForExprot";
    formForExport.name = "formForExprot";
    formForExport.style.display= 'none';
    // 添加到 body 中
    document.body.appendChild(formForExport);

    // form 的提交方式
    formForExport.method = "GET";
    // form 提交路径
    formForExport.action = url;

    formForExport.enctype = 'multipart/form-data';
    // 对该 form 执行提交

    for(let key in conditions){
        if(conditions[key]){
            let input = document.createElement("input");
            // 设置相应参数
            input.type = "text";
            input.name = key;
            input.value = conditions[key];
            // 将该输入框插入到 form 中
            formForExport.appendChild(input);
        }
    }

    formForExport.submit();
    // 删除该 form
    document.body.removeChild(formForExport);
}

//根据医院和科室查询医生列表
export const getConditionDoctorList = (param) => {
    let action = actions.GET_CONDITION_DOCTOR_LIST;

    return {
        // 要在之前和之后发送的 action types
        types: [action + '_REQUEST', action + '_SUCCESS', action + '_FAILURE'],
        // 检查缓存 (可选):
        //shouldCallAPI: (state) => !state.users[userId],
        // 进行取：http://192.168.2.83:8080/healthd-manage/v2/doctor/page
        callAPI: (token) => fetch(`${actions.WEB_API_URI}/doctor/page?${param}`,{
            method: 'GET',
            headers: {
                [actions.HEADER_AUTH_FIELD]: actions.HEADER_AUTH_PREFIX + token
            }
        })
    };
};

//医院列表
export const getHospitalList = () => {
    let action = actions.GET_HOSPITAL_LIST;

    return {
        // 要在之前和之后发送的 action types
        types: [action + '_REQUEST', action + '_SUCCESS', action + '_FAILURE'],
        // 检查缓存 (可选):
        //shouldCallAPI: (state) => !state.users[userId],
        // 进行取：http://192.168.2.83:8080/healthd-manage/v2/manage-query-params/hospital
        callAPI: (token) => fetch(`${actions.WEB_API_URI}/manage-query-params/hospital`,{
            method: 'GET',
            headers: {
                [actions.HEADER_AUTH_FIELD]: actions.HEADER_AUTH_PREFIX + token
            }
        })
    };
};

//科室列表
export const getDepartmentList = () => {
    let action = actions.GET_DEPARTMENT_LIST;

    return {
        // 要在之前和之后发送的 action types
        types: [action + '_REQUEST', action + '_SUCCESS', action + '_FAILURE'],
        // 检查缓存 (可选):
        //shouldCallAPI: (state) => !state.users[userId],
        // 进行取：http://192.168.2.83:8080/healthd-manage/v2/manage-query-params/hospital-department
        callAPI: (token) => fetch(`${actions.WEB_API_URI}/manage-query-params/hospital-department`,{
            method: 'GET',
            headers: {
                [actions.HEADER_AUTH_FIELD]: actions.HEADER_AUTH_PREFIX + token
            }
        })
    };
};

//根据条件导出医生列表
export const exportConditionDoctorList = (conditions) => {
    exportData(`${actions.WEB_API_URI}/doctor/excel_doctor`,conditions);
    //http://192.168.2.83:8080/healthd-manage/v2/doctor/excel_doctor
};

//添加医生请求页面内容
export const getAddDoctorContent = () => {
    let action = actions.GET_ADD_DOCTOR_CONTENT;

    return {
        // 要在之前和之后发送的 action types
        types: [action + '_REQUEST', action + '_SUCCESS', action + '_FAILURE'],
        // 检查缓存 (可选):
        //shouldCallAPI: (state) => !state.users[userId],
        // 进行取：http://192.168.2.83:8080/healthd-manage/v2/doctor/add
        callAPI: (token) => fetch(`${actions.WEB_API_URI}/doctor/add`,{
            method: 'GET',
            headers: {
                [actions.HEADER_AUTH_FIELD]: actions.HEADER_AUTH_PREFIX + token
            }
        })
    };
};


//添加医生之前验证邮箱,身份证号码是否已经注册
export const postCheckEmailIdentity = (params) => {

    let action = actions.POST_CHECK_EMAIL_IDENTITY;
    return {
        // 要在之前和之后发送的 action types
        types: [action + '_REQUEST', action + '_SUCCESS', action + '_FAILURE'],
        // 检查缓存 (可选):
        //shouldCallAPI: (state) => !state.users[userId],
        // 进行取：http://192.168.2.83:8080/healthd-manage/v2/validate/ajaxGetDoctor
        callAPI: (token) => fetch(`${actions.WEB_API_URI}/validate/ajaxGetDoctor`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json; charset=UTF-8',
                [actions.HEADER_AUTH_FIELD]: actions.HEADER_AUTH_PREFIX + token
            },
            body: JSON.stringify(params)
        })
    };
};


//编辑医生时验证邮箱,身份证号码是否已经注册
export const postEditEmailIdentity = (params) => {

    let action = actions.POST_Edit_EMAIL_IDENTITY;
    return {
        // 要在之前和之后发送的 action types
        types: [action + '_REQUEST', action + '_SUCCESS', action + '_FAILURE'],
        // 检查缓存 (可选):
        //shouldCallAPI: (state) => !state.users[userId],
        // 进行取：http://192.168.2.83:8080/healthd-manage/v2/validate/ajaxGetEditDoctor
        callAPI: (token) => fetch(`${actions.WEB_API_URI}/validate/ajaxGetEditDoctor`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json; charset=UTF-8',
                [actions.HEADER_AUTH_FIELD]: actions.HEADER_AUTH_PREFIX + token
            },
            body: JSON.stringify(params)
        })
    };
};

//添加医生
export const postAddDoctor = (params) => {
    let action = actions.POST_ADD_DOCTOR;

    return {
        // 要在之前和之后发送的 action types
        types: [action + '_REQUEST', action + '_SUCCESS', action + '_FAILURE'],
        // 检查缓存 (可选):
        //shouldCallAPI: (state) => !state.users[userId],
        // 进行取：http://192.168.2.83:8080/healthd-manage/v2/doctor/insert
        callAPI: (token) => fetch(`${actions.WEB_API_URI}/doctor/insert`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json; charset=UTF-8',
                [actions.HEADER_AUTH_FIELD]: actions.HEADER_AUTH_PREFIX + token
            },
            body: JSON.stringify(params)
        })
    };
};

//编辑医生请求页面内容
export const postEditDoctorContent = (params) => {
    let action = actions.POST_EDIT_DOCTOR_CONTENT;

    return {
        // 要在之前和之后发送的 action types
        types: [action + '_REQUEST', action + '_SUCCESS', action + '_FAILURE'],
        // 检查缓存 (可选):
        //shouldCallAPI: (state) => !state.users[userId],
        // 进行取：http://192.168.2.83:8080/healthd-manage/v2/doctor/edit
        callAPI: (token) => fetch(`${actions.WEB_API_URI}/doctor/edit`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json; charset=UTF-8',
                [actions.HEADER_AUTH_FIELD]: actions.HEADER_AUTH_PREFIX + token
            },
            body: JSON.stringify(params)
        })
    };
};

//编辑医生
export const postEditDoctor = (params) => {
    let action = actions.POST_EDIT_DOCTOR;

    return {
        // 要在之前和之后发送的 action types
        types: [action + '_REQUEST', action + '_SUCCESS', action + '_FAILURE'],
        // 检查缓存 (可选):
        //shouldCallAPI: (state) => !state.users[userId],
        // 进行取：http://192.168.2.83:8080/healthd-manage/v2/doctor/update
        callAPI: (token) => fetch(`${actions.WEB_API_URI}/doctor/update`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json; charset=UTF-8',
                [actions.HEADER_AUTH_FIELD]: actions.HEADER_AUTH_PREFIX + token
            },
            body: JSON.stringify(params)
        })
    };
};

//停用启动账号
export const postOperateAccount = (params) => {
    let action = actions.POST_OPERATE_ACCOUNT;

    return {
        // 要在之前和之后发送的 action types
        types: [action + '_REQUEST', action + '_SUCCESS', action + '_FAILURE'],
        // 检查缓存 (可选):
        //shouldCallAPI: (state) => !state.users[userId],
        // 进行取：http://192.168.2.83:8080/healthd-manage/v2/doctor/updateDoctorStatus
        callAPI: (token) => fetch(`${actions.WEB_API_URI}/doctor/updateDoctorStatus`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json; charset=UTF-8',
                [actions.HEADER_AUTH_FIELD]: actions.HEADER_AUTH_PREFIX + token
            },
            body: JSON.stringify(params)
        })
    };
};

//重置密码
export const postResetPwd = (params) => {
    let action = actions.POST_RESET_PWD;

    return {
        // 要在之前和之后发送的 action types
        types: [action + '_REQUEST', action + '_SUCCESS', action + '_FAILURE'],
        // 检查缓存 (可选):
        //shouldCallAPI: (state) => !state.users[userId],
        // 进行取：http://192.168.2.83:8080/healthd-manage/v2/doctor/restpassword
        callAPI: (token) => fetch(`${actions.WEB_API_URI}/doctor/restpassword`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json; charset=UTF-8',
                [actions.HEADER_AUTH_FIELD]: actions.HEADER_AUTH_PREFIX + token
            },
            body: JSON.stringify(params)
        })
    };
};

//医生排班首页排班时间列表
export const postScheduleList = () => {
    let action = actions.POST_SCHEDULE_LIST;

    return {
        // 要在之前和之后发送的 action types
        types: [action + '_REQUEST', action + '_SUCCESS', action + '_FAILURE'],
        // 检查缓存 (可选):
        //shouldCallAPI: (state) => !state.users[userId],
        // 进行取：http://192.168.2.83:8080/healthd-manage/v2/schedulingHospital/list
        callAPI: (token) => fetch(`${actions.WEB_API_URI}/schedulingHospital/list`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json; charset=UTF-8',
                [actions.HEADER_AUTH_FIELD]: actions.HEADER_AUTH_PREFIX + token
            }
        })
    };
};


//医生排班排班选择条件后条用
export const postScheduleChoseConditions = (params) => {
    let action = actions.POST_SCHEDULE_CHOSE_CONDITIONS;

    return {
        // 要在之前和之后发送的 action types
        types: [action + '_REQUEST', action + '_SUCCESS', action + '_FAILURE'],
        // 检查缓存 (可选):
        //shouldCallAPI: (state) => !state.users[userId],
        // 进行取：http://192.168.2.83:8080/healthd-manage/v2/schedulingHospital/schedulingDocAjax
        callAPI: (token) => fetch(`${actions.WEB_API_URI}/schedulingHospital/schedulingDocAjax`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json; charset=UTF-8',
                [actions.HEADER_AUTH_FIELD]: actions.HEADER_AUTH_PREFIX + token
            },
            body: JSON.stringify(params)
        })
    };
};



//根据条件查询医院列表
export const getConditionHospitalList = (param) => {
    let action = actions.GET_CONDITION_HOSPITAL_LIST;

    return {
        // 要在之前和之后发送的 action types
        types: [action + '_REQUEST', action + '_SUCCESS', action + '_FAILURE'],
        // 检查缓存 (可选):
        //shouldCallAPI: (state) => !state.users[userId],
        // 进行取：http://192.168.2.83:8080/healthd-manage/v2/hospital/list?size=10&curr=1
        callAPI: (token) => fetch(`${actions.WEB_API_URI}/hospital/list?${param}`,{
            method: 'GET',
            headers: {
                [actions.HEADER_AUTH_FIELD]: actions.HEADER_AUTH_PREFIX + token
            }
        })
    };
};

//删除医院
export const postDeleteHospital = (params) => {
    let action = actions.POST_DELETE_HOSPITAL;

    return {
        // 要在之前和之后发送的 action types
        types: [action + '_REQUEST', action + '_SUCCESS', action + '_FAILURE'],
        // 检查缓存 (可选):
        //shouldCallAPI: (state) => !state.users[userId],
        // 进行取：http://192.168.2.83:8080/healthd-manage/v2/hospital/delHospital
        callAPI: (token) => fetch(`${actions.WEB_API_URI}/hospital/delHospital`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json; charset=UTF-8',
                [actions.HEADER_AUTH_FIELD]: actions.HEADER_AUTH_PREFIX + token
            },
            body: JSON.stringify(params)
        })
    };
};

//点击编辑医院时页面跳转
export const postEditHospitalContent = (params) => {
    let action = actions.POST_EDIT_HOSPITAL_CONTENT;

    return {
        // 要在之前和之后发送的 action types
        types: [action + '_REQUEST', action + '_SUCCESS', action + '_FAILURE'],
        // 检查缓存 (可选):
        //shouldCallAPI: (state) => !state.users[userId],
        // 进行取：http://192.168.2.83:8080/healthd-manage/v2/hospital/edit
        callAPI: (token) => fetch(`${actions.WEB_API_URI}/hospital/edit`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json; charset=UTF-8',
                [actions.HEADER_AUTH_FIELD]: actions.HEADER_AUTH_PREFIX + token
            },
            body: JSON.stringify(params)
        })
    };
};

//添加，编辑医院时保存操作
export const postSaveHospital = (params) => {
    let action = actions.POST_SAVE_HOSPITAL;

    return {
        // 要在之前和之后发送的 action types
        types: [action + '_REQUEST', action + '_SUCCESS', action + '_FAILURE'],
        // 检查缓存 (可选):
        //shouldCallAPI: (state) => !state.users[userId],
        // 进行取：http://192.168.2.83:8080/healthd-manage/v2/hospital/save
        callAPI: (token) => fetch(`${actions.WEB_API_URI}/hospital/save`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json; charset=UTF-8',
                [actions.HEADER_AUTH_FIELD]: actions.HEADER_AUTH_PREFIX + token
            },
            body: JSON.stringify(params)
        })
    };
};


//点击定制管理权限按钮调用接口
export const postManageHospital = (params) => {
    let action = actions.POST_MANAGE_HOSPITAL;

    return {
        // 要在之前和之后发送的 action types
        types: [action + '_REQUEST', action + '_SUCCESS', action + '_FAILURE'],
        // 检查缓存 (可选):
        //shouldCallAPI: (state) => !state.users[userId],
        // 进行取：http://192.168.2.83:8080/healthd-manage/v2/hospital/user/list
        callAPI: (token) => fetch(`${actions.WEB_API_URI}/hospital/user/list`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json; charset=UTF-8',
                [actions.HEADER_AUTH_FIELD]: actions.HEADER_AUTH_PREFIX + token
            },
            body: JSON.stringify(params)
        })
    };
};
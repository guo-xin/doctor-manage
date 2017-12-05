import * as actions from './actions';
import fetch from 'isomorphic-fetch';

//设置当前问诊列表条件信息
export const setCurrentCase = actions.create(actions.SET_CURRENT_CASE, 'data');
//设置当前通话列表条件信息
export const setCurrentCall = actions.create(actions.SET_CURRENT_CALL, 'data');

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

//所有医院
export const getAllHospital = () => {
    let action = actions.GET_ALL_HOSPITAL;

    return {
        // 要在之前和之后发送的 action types
        types: [action + '_REQUEST', action + '_SUCCESS', action + '_FAILURE'],
        // 检查缓存 (可选):
        //shouldCallAPI: (state) => !state.users[userId],
        // 进行取：http://192.168.0.182:8080/healthd-admin/v2/query-params/hospital
        callAPI: (token) => fetch(`${actions.WEB_API_URI}/query-params/hospital`,{
            method: 'GET',
            headers: {
                [actions.HEADER_AUTH_FIELD]: actions.HEADER_AUTH_PREFIX + token
            }
        })
    };
};

//所有科室
export const getAllDepartment = () => {
    let action = actions.GET_ALL_DEPARTMENT;

    return {
        // 要在之前和之后发送的 action types
        types: [action + '_REQUEST', action + '_SUCCESS', action + '_FAILURE'],
        // 检查缓存 (可选):
        //shouldCallAPI: (state) => !state.users[userId],
        // 进行取：http://192.168.0.164:8080/healthd-admin/v2/query-params/hospital-department
        callAPI: (token) => fetch(`${actions.WEB_API_URI}/query-params/hospital-department`,{
            method: 'GET',
            headers: {
                [actions.HEADER_AUTH_FIELD]: actions.HEADER_AUTH_PREFIX + token
            }
        })
    };
};

//根据医院和科室查询医生
export const getDoctorByHospital = (param) => {
    let action = actions.GET_DOCTOR_BY_HOSPITAL;

    return {
        // 要在之前和之后发送的 action types
        types: [action + '_REQUEST', action + '_SUCCESS', action + '_FAILURE'],
        // 检查缓存 (可选):
        //shouldCallAPI: (state) => !state.users[userId],
        // 进行取：http://192.168.0.164:8080/healthd-admin/v2/query-params/doctor-subjection?hospitalId=2&hospitalDepartmentId=2
        callAPI: (token) => fetch(`${actions.WEB_API_URI}/query-params/doctor-subjection?${param}`,{
            method: 'GET',
            headers: {
                [actions.HEADER_AUTH_FIELD]: actions.HEADER_AUTH_PREFIX + token
            }
        })
    };
};

//根据条件查询病历列表
export const getConditionCaseList = (params) => {
    let action = actions.GET_CONDITION_CASE_LIST;

    return {
        // 要在之前和之后发送的 action types
        types: [action + '_REQUEST', action + '_SUCCESS', action + '_FAILURE'],
        // 检查缓存 (可选):
        //shouldCallAPI: (state) => !state.users[userId],
        // 进行取：history-case-statistics/list?hospitalId=1&departmentId=1&doctorId=95&patientRealName=康&userName=15&status=1&startTime=20160208&endTime=20160506&size=20&curr=1
        callAPI: (token) => fetch(`${actions.WEB_API_URI}/history-case-statistics/list?${params}`,{
            method: 'GET',
            headers: {
                [actions.HEADER_AUTH_FIELD]: actions.HEADER_AUTH_PREFIX + token
            }
        })
    };
};

//根据条件导出病历列表
export const exportConditionCaseList = (conditions) => {
    exportData(`${actions.WEB_API_URI}/history-case-statistics/export`, conditions);
   //history-case-statistics/export?hospitalId=1&departmentId=1&doctorId=95&patientRealName=康&userName=15&status=1
};

//根据条件查询通话记录列表
export const getConditionCallList = (params) => {
    let action = actions.GET_CONDITION_CALL_LIST;

    return {
        // 要在之前和之后发送的 action types
        types: [action + '_REQUEST', action + '_SUCCESS', action + '_FAILURE'],
        // 检查缓存 (可选):
        //shouldCallAPI: (state) => !state.users[userId],
        // 进行取：communication-record-statistics/list?hospitalId=1&operatorRoleCode=105&isException=1&startTime=2016-02-15&endTime=2016-05-30
        callAPI: (token) => fetch(`${actions.WEB_API_URI}/communication-record-statistics/list?${params}`,{
            method: 'GET',
            headers: {
                [actions.HEADER_AUTH_FIELD]: actions.HEADER_AUTH_PREFIX + token
            }
        })
    };
};


//根据条件导出通话记录列表
export const exportConditionCallList = (conditions) => {
    exportData(`${actions.WEB_API_URI}/communication-record-statistics/export`,conditions);
    //communication-record-statistics/export?hospitalId=1&operatorRoleCode=105&isException=1
};

//根据病历id查询病历详情
export const getCaseDetailByCaseId = (caseId) => {
    let action = actions.GET_CASE_DETAIL_BY_CASEID;

    return {
        // 要在之前和之后发送的 action types
        types: [action + '_REQUEST', action + '_SUCCESS', action + '_FAILURE'],
        // 检查缓存 (可选):
        //shouldCallAPI: (state) => !state.users[userId],
        // 进行取：http://192.168.2.28:8086/v2/case/query/2559
        callAPI: (token) => fetch(`${actions.CASE_API_URI}/case/query/${caseId}`,{
            method: 'GET',
            headers: {
                [actions.HEADER_AUTH_FIELD]: actions.HEADER_AUTH_PREFIX + token
            }
        })
    };
};

//根据患者id查询患者信息
export const getPatientByPatientId = (patientId) => {
    let action = actions.GET_PATIENT_BY_PATIENTID;

    return {
        // 要在之前和之后发送的 action types
        types: [action + '_REQUEST', action + '_SUCCESS', action + '_FAILURE'],
        // 检查缓存 (可选):
        //shouldCallAPI: (state) => !state.users[userId],
        // 进行取：http://192.168.2.28:8086/v2/patient/831
        callAPI: (token) => fetch(`${actions.CASE_API_URI}/patient/${patientId}`,{
            method: 'GET',
            headers: {
                [actions.HEADER_AUTH_FIELD]: actions.HEADER_AUTH_PREFIX + token
            }
        })
    };
};

//根据问诊id查询以视音频记录
export const getCallByInqiryId = (params) => {
    let action = actions.GET_CALL_BY_INQUIRYID;

    return {
        // 要在之前和之后发送的 action types
        types: [action + '_REQUEST', action + '_SUCCESS', action + '_FAILURE'],
        // 检查缓存 (可选):
        //shouldCallAPI: (state) => !state.users[userId],
        // 进行取：http://localhost:8080/healthd-api/v2/ocx/record/list/{inquiryId}
        callAPI: (token) => fetch(`${actions.WEB_API_URI}/ocx/record/list?${params}`,{
            method: 'GET',
            headers: {
                [actions.HEADER_AUTH_FIELD]: actions.HEADER_AUTH_PREFIX + token
            }
        })
    };
};

//根据url解析诊疗意见
export const getDiagnosisByUrl = (params) => {
    let action = actions.GET_DIAGNOSIS_BY_URL;

    return {
        // 要在之前和之后发送的 action types
        types: [action + '_REQUEST', action + '_SUCCESS', action + '_FAILURE'],
        // 检查缓存 (可选):
        //shouldCallAPI: (state) => !state.users[userId],
        // 进行取：http://localhost:8080/healthd-tools/v2/parser/html/url?url=111
        callAPI: (token) => fetch(`${actions.FILE_API_URI}/parser/html/url?url=${params}`,{
            method: 'GET',
            headers: {
                [actions.HEADER_AUTH_FIELD]: actions.HEADER_AUTH_PREFIX + token
            }
        })
    };
};
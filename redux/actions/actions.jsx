export const WEB_API_URI = window.baseApi;
export const CASE_API_URI = window.caseApi;
export const FILE_API_URI = window.fileApi;
export const HEADER_AUTH_FIELD = "T";
export const HEADER_AUTH_PREFIX = "";

/* ---------- 统计 start ---------- */
export const GET_ALL_DEPARTMENT = "GET_ALL_DEPARTMENT";//所有科室
export const GET_ALL_HOSPITAL = "GET_ALL_HOSPITAL";//所有医院
export const GET_DOCTOR_BY_HOSPITAL = "GET_DOCTOR_BY_HOSPITAL";//根据医院和科室查询医生
export const GET_CONDITION_CASE_LIST = "GET_CONDITION_CASE_LIST";//根据条件查询病历列表
export const SET_CURRENT_CASE = "SET_CURRENT_CASE";//保存当前问诊列表条件信息到状态树

export const SET_CURRENT_CALL = "SET_CURRENT_CALL";//保存当前通话列表条件信息到状态树
export const GET_CONDITION_CALL_LIST = "GET_CONDITION_CALL_LIST";//根据条件查询通话记录列表
/* ---------- 统计 end ---------- */

/* ---------- 管理 start ---------- */
/* --- 医生--- */
export const GET_CONDITION_DOCTOR_LIST = "GET_CONDITION_DOCTOR_LIST";//根据医院和科室查询医生列表
export const SET_CURRENT_DOCTOR = "SET_CURRENT_DOCTOR";//保存当前医生列表条件信息到状态树
export const GET_HOSPITAL_LIST = "GET_HOSPITAL_LIST";//医院列表
export const GET_DEPARTMENT_LIST = "GET_DEPARTMENT_LIST";//科室列表
export const GET_ADD_DOCTOR_CONTENT = "GET_ADD_DOCTOR_CONTENT";//添加医生请求页面内容
export const POST_EDIT_DOCTOR_CONTENT = "POST_EDIT_DOCTOR_CONTENT";//编辑医生请求页面内容
export const POST_CHECK_EMAIL_IDENTITY = "POST_CHECK_EMAIL_IDENTITY";//添加医生之前验证邮箱,身份证号码是否已经注册
export const POST_Edit_EMAIL_IDENTITY = "POST_Edit_EMAIL_IDENTITY";//编辑医生时验证邮箱,身份证号码是否已经注册
export const POST_ADD_DOCTOR = "POST_ADD_DOCTOR";//添加医生
export const POST_EDIT_DOCTOR = "POST_EDIT_DOCTOR";//编辑医生
export const POST_OPERATE_ACCOUNT = "POST_OPERATE_ACCOUNT";//停用启动账号
export const POST_RESET_PWD = "POST_RESET_PWD";//重置密码

/* --- 排班--- */
export const POST_SCHEDULE_LIST = "POST_SCHEDULE_LIST";//医生排班首页排班时间列表
export const POST_SCHEDULE_CHOSE_CONDITIONS = "POST_SCHEDULE_CHOSE_CONDITIONS";//医生排班排班选择条件后条用


/* --- 医院--- */
export const GET_CONDITION_HOSPITAL_LIST = "GET_CONDITION_HOSPITAL_LIST";//根据条件查询医院列表
export const POST_EDIT_HOSPITAL_CONTENT = "POST_EDIT_HOSPITAL_CONTENT";//点击编辑医院时页面跳转
export const POST_SAVE_HOSPITAL = "POST_SAVE_HOSPITAL";//添加，编辑医院时保存操作

export const POST_DELETE_HOSPITAL = "POST_DELETE_HOSPITAL";//删除医院


export const POST_MANAGE_HOSPITAL = "POST_MANAGE_HOSPITAL";//点击定制管理权限按钮调用接口

/* --- 用户--- */
//export const GET_CONDITION_USER_LIST = "GET_CONDITION_USER_LIST";//根据条件查询用户列表

/* ---------- 管理 end ---------- */


/* ---------- 病历相关 start ---------- */
export const GET_CASE_DETAIL_BY_CASEID = "GET_CASE_DETAIL_BY_CASEID";//根据病历id查询病历详情
export const GET_DIAGNOSIS_BY_URL = "GET_DIAGNOSIS_BY_URL";//根据url解析诊疗意见
export const GET_PATIENT_BY_PATIENTID = "GET_PATIENT_BY_PATIENTID";//根据患者id查询患者信息
export const GET_CALL_BY_INQUIRYID = "GET_CALL_BY_INQUIRYID";//根据问诊id查询以视音频记录
/* ---------- 病历 end ---------- */

/* ---------- 登录认证相关操作 start ---------- */
export const SIGN_OUT = "SIGN_OUT";//退出
/* ---------- 登录认证相关操作 end ---------- */

export function create(type, ...argNames) {
    return function (...args) {
        let action = {type};
        argNames.forEach((arg, index) => {
            action[argNames[index]] = args[index]
        });
        return action;
    }
}

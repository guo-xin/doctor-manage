import * as actions from '../actions/actions';
import * as global from 'util/global';

const stats = (state = {
    cases: {
        data: [],
        pagination: {}
    },
    calls: {
        data: [],
        pagination: {}
    },
    caseConditions: {
        size: 10,
        curr: 1,
        hospitalId: '',
        departmentId: '',
        doctorId: '',
        status: '',
        patientRealName: '',
        userName: '',
        callTime: [global.formatDay(new Date()), global.formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss')]
    },
    callConditions: {
        size: 10,
        curr: 1,
        hospitalId: '',
        isException: '',
        operatorRoleCode: '',
        inquiryCallType: '',
        callTime: []
    },
    department: [],
    hospital: [],
    doctor: [],
    caseDetail: {},
    patientInfo: {},
    callList: [],
    options: ''
}, action) => {
    let obj, data, results;

    switch (action.type) {
        //所有医院
        case actions.GET_ALL_HOSPITAL + "_SUCCESS":
            state.hospital = (action.response || {}).data || [];
            obj = Object.assign({}, state);
            return obj;

        //所有科室
        case actions.GET_ALL_DEPARTMENT + "_SUCCESS":
            state.department = (action.response || {}).data || [];
            obj = Object.assign({}, state);
            return obj;

        //根据医院和科室查询医生
        case actions.GET_DOCTOR_BY_HOSPITAL + "_SUCCESS":
            state.doctor = (action.response || {}).data || [];
            obj = Object.assign({}, state);
            return obj;

        //根据条件查询病历列表
        case actions.GET_CONDITION_CASE_LIST + "_SUCCESS":
            data = (action.response || {}).data || {};
            results = data.lists || [];

            state.cases.data = results.map((item, index)=> {
                item.key = index;
                return item;
            });

            state.cases.pagination.total = data.total;

            obj = Object.assign({}, state);
            return obj;

        //根据条件查询通话记录列表
        case actions.GET_CONDITION_CALL_LIST + "_SUCCESS":
            data = (action.response || {}).data || {};
            results = data.lists || [];

            state.calls.data = results.map((item, index)=> {
                item.key = index;
                return item;
            });

            state.calls.pagination.total = data.total;

            obj = Object.assign({}, state);
            return obj;

        //根据病历id查询病历详情
        case actions.GET_CASE_DETAIL_BY_CASEID + "_SUCCESS":
            state.caseDetail = (action.response || {}).data || {};
            obj = Object.assign({}, state);
            return obj;

        //根据url解析诊疗意见
        case actions.GET_DIAGNOSIS_BY_URL + "_SUCCESS":
            state.options = (action.response || {}).data || '';
            obj = Object.assign({}, state);
            return obj;

        //根据患者id查询患者信息
        case actions.GET_PATIENT_BY_PATIENTID + "_SUCCESS":
            state.patientInfo = (action.response || {}).data || {};
            obj = Object.assign({}, state);
            return obj;

        //根据问诊id查询以视音频记录
        case actions.GET_CALL_BY_INQUIRYID + "_SUCCESS":
            state.callList = (action.response || {}).data || [];
            obj = Object.assign({}, state);
            return obj;

        //设置当前问诊列表条件信息
        case actions.SET_CURRENT_CASE:
            data = action.data;
            if (data) {
                state.caseConditions = Object.assign({}, state.caseConditions, data.caseConditions);
            }
            return Object.assign({}, state);

        //设置当前通话列表条件信息
        case actions.SET_CURRENT_CALL:
            data = action.data;
            if (data) {
                state.callConditions = Object.assign({}, state.callConditions, data.callConditions);
            }
            return Object.assign({}, state);

        default:
            return state
    }
};

export default stats;
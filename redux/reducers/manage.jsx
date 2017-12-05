import * as actions from '../actions/actions';
import * as global from 'util/global';

const manages = (state = {
    doctors: {
        data: [],
        pagination: {}
    },
    hospitals: {
        data: [],
        pagination: {}
    },
    admins: {
        data: [],
        pagination: {}
    },
    doctorConditions: {
        size: 10,
        curr: 1,
        realname: '',
        hospitalId: '',
        departmentId: ''
    },
    department: [],
    hospital: [],
    content:{},
    result:'',
    hospitalList:{},
    information:{}


}, action) => {
    let obj, data, results;

    switch (action.type) {
        //根据医院和科室查询医生列表
        case actions.GET_CONDITION_DOCTOR_LIST + "_SUCCESS":
            data = (action.response || {}).data || {};
            results = data.results || [];

            state.doctors.data = results.map((item, index)=> {
                item.key = index;
                return item;
            });

            state.doctors.pagination.total = data.total;

            obj = Object.assign({}, state);
            return obj;

        //医院列表
        case actions.GET_HOSPITAL_LIST + "_SUCCESS":
            state.hospital = (action.response || {}).data || [];
            obj = Object.assign({}, state);
            return obj;

        //科室列表
        case actions.GET_DEPARTMENT_LIST + "_SUCCESS":
            state.department = (action.response || {}).data || [];
            obj = Object.assign({}, state);
            return obj;

        //保存当前医生列表条件信息到状态树
        case actions.SET_CURRENT_DOCTOR:
            data = action.data;
            if (data) {
                state.doctorConditions = Object.assign({}, state.doctorConditions, data.doctorConditions);
            }
            return Object.assign({}, state);

        //添加医生请求页面内容
        case actions.GET_ADD_DOCTOR_CONTENT + "_SUCCESS":
            state.content = (action.response || {}).data || [];
            obj = Object.assign({}, state);
            return obj;

        //编辑医生请求页面内容
        case actions.POST_EDIT_DOCTOR_CONTENT + "_SUCCESS":
            state.content = (action.response || {}).data || [];
            obj = Object.assign({}, state);
            return obj;

        //添加医生
        case actions.POST_ADD_DOCTOR + "_SUCCESS":
            state.result = (action.response || {}).result;
            obj = Object.assign({}, state);
            return obj;

        //编辑医生
        case actions.POST_EDIT_DOCTOR + "_SUCCESS":
            state.result = (action.response || {}).result;
            obj = Object.assign({}, state);
            return obj;

        //医生排班首页排班时间列表
        case actions.POST_SCHEDULE_LIST + "_SUCCESS":
            state.hospitalList = (action.response || {}).data || {};

            obj = Object.assign({}, state);
            return obj;

        //医生排班排班选择条件后条用
        case actions.POST_SCHEDULE_CHOSE_CONDITIONS + "_SUCCESS":
            state.information = (action.response || {}).data || {};
            obj = Object.assign({}, state);
            return obj;



        //根据条件查询医院列表
        case actions.GET_CONDITION_HOSPITAL_LIST + "_SUCCESS":
            data = (action.response || {}).data || {};
            results = data.results || [];

            state.hospitals.data = results.map((item, index)=> {
                item.key = index;
                return item;
            });

            state.hospitals.pagination.total = data.total;

            obj = Object.assign({}, state);
            return obj;

        //点击定制管理权限按钮调用接口
        case actions.POST_MANAGE_HOSPITAL + "_SUCCESS":
            data = (action.response || {}).data || {};
            data = data.pagemodel;
            results = data.results || [];

            state.admins.data = results.map((item, index)=> {
                item.key = index;
                return item;
            });

            state.admins.pagination.total = data.total;

            obj = Object.assign({}, state);
            return obj;


        default:
            return state
    }
};

export default manages;
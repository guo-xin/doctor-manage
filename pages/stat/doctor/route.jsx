import React from 'react';
import Case from './case';
import Call from './call';
import Detail from './case/detail';
import Doctor from './doctor';

module.exports = {
    path: 'doctor',
    component: Doctor,
    indexRoute: {onEnter: (nextState, replace) => replace('/stat/doctor/case')},
    childRoutes: [
        {path: 'case', component: Case},
        {path: 'call', component: Call},
        {path: 'caseDetail', component: Detail}
    ]
};




import React from 'react';
import Manage from './manage';
import AddDoctor from './operate/addDoctor';
import Index from './index';

module.exports = {
    path: 'doctor',
    component: Index,
    indexRoute: {onEnter: (nextState, replace) => replace('/manage/doctor/manage')},
    childRoutes: [
        {path: 'manage', component: Manage},
        {path: 'edit(/:id)', component: AddDoctor}
    ]
};




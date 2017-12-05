import React from 'react';
import Config from './config';
import Permission from './permission';
import AddHospital from './operate/AddHospital';
import Index from './index';

module.exports = {
    path: 'hospital',
    component: Index,
    indexRoute: {onEnter: (nextState, replace) => replace('/manage/hospital/config')},
    childRoutes: [
        {path: 'config', component: Config},
        {path: 'edit(/:id)', component: AddHospital},
        {path: 'permission', component: Permission}
    ]
};




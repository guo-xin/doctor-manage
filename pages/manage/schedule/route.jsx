import React from 'react';
import Plan from './plan';
import Index from './index';

module.exports = {
    path: 'schedule',
    component: Index,
    indexRoute: {onEnter: (nextState, replace) => replace('/manage/schedule/plan')},
    childRoutes: [
        {path: 'plan', component: Plan}
    ]
};




import Manage from './manage';

module.exports = {
    path: 'manage',
    component: Manage,
    indexRoute: { onEnter: (nextState, replace) => replace('/manage/doctor') },
    childRoutes: [
        require('./doctor/route'),
        require('./hospital/route'),
        require('./schedule/route')
    ]
};
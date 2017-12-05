import Stat from './stat';

module.exports = {
    path: 'stat',
    component: Stat,
    indexRoute: { onEnter: (nextState, replace) => replace('/stat/doctor') },
    childRoutes: [
        require('./doctor/route')
    ]
};
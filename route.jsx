import {requireAuthentication} from './components/auth/authenticatedComponent';

const baseDir = './pages';

module.exports = {
    component: 'div',

    childRoutes: [
        {
            path: '/',
            component: requireAuthentication(require(baseDir + '/index')),
            indexRoute: {onEnter: (nextState, replace) => replace('/stat')},
            childRoutes: [
                require(baseDir + '/stat/route'),
                require(baseDir + '/manage/route')
            ]
        }
    ]
};
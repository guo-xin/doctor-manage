import { combineReducers } from 'redux';
import stats from './stat';
import manages from './manage';

const reducers = combineReducers({
    statStore: stats,
    manageStore: manages
});

export default reducers
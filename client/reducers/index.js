import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import headerReducer from 'common/header/reducer';
import loginReducer from 'app/login/reducer';
import searchReducer from 'app/search/reducer';
import scoringReducer from 'app/scoring/reducer';

const combinedReducer = combineReducers({
  routing: routerReducer,
  headerReducer,
  loginReducer,
  searchReducer,
  scoringReducer,
});

export default (state, action) => (combinedReducer(state, action));

import { combineReducers } from 'redux';
import user from './user';
import flash from './flash';
import activeModule from './activeModule';
import activeStudent from './activeStudent';

const rootReducer = combineReducers({
  user,
  flash,
  activeStudent,
  activeModule,
});

export default rootReducer;

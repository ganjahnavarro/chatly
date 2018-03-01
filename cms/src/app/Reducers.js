import { combineReducers } from "redux";
import auth from './modules/auth/reducers';

const app = combineReducers({
	auth
})

export default app;
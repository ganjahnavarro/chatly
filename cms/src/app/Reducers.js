import { combineReducers } from "redux";
import auth from './modules/auth/reducers';
import common from "./modules/common/reducers";

const app = combineReducers({
	loading: common.loading,
	modal: common.modal,
	auth
})

export default app;
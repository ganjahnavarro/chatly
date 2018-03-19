import { combineReducers } from "redux";
import auth from './modules/auth/reducers';
import common from "./modules/common/reducers";
import product from "./modules/product/reducers";
import category from "./modules/category/reducers";
import branch from "./modules/branch/reducers";

const app = combineReducers({
	loading: common.loading,
	modal: common.modal,
	auth,
	product,
	category,
	branch
})

export default app;
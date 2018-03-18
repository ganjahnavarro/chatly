import { combineReducers } from "redux";
import auth from './modules/auth/reducers';
import common from "./modules/common/reducers";
import product from "./modules/product/reducers";
import category from "./modules/category/reducers";

const app = combineReducers({
	loading: common.loading,
	modal: common.modal,
	auth,
	product,
	category
})

export default app;
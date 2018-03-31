import * as c from '../constants';
import { Map, fromJS, List } from 'immutable';

const initState = Map({
	list: List([]),
	selected: Map({}),
	product_type_form: Map(c.PRODUCT_TYPE_FORM),
	selected_product: Map({}),
	product_form: Map(c.PRODUCT_FORM),
})

export default (state = initState, action) => {
	switch(action.type){
		case c.GOT_LIST:
			return state.set('list', fromJS(action.data));
		case c.GOT:
			return state.set('selected', fromJS(action.data));
		case c.SET_FORM:
			return state.update(action.form, (formData) => formData.merge(fromJS(action.data)))
		case c.GOT_PRODUCT:
			return state.set('selected_product', fromJS(action.data));
		case c.CLEAR_STATE:
			return initState;
		default:
			return state;
	}
}
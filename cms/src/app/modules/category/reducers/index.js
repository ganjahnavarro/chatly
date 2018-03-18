import * as c from '../constants';
import { Map, fromJS, List } from 'immutable';

const initState = Map({
	list: List([]),
	selected: Map({}),
	category_form: Map(c.CATEGORY_FORM)
})

export default (state = initState, action) => {
	switch(action.type){
		case c.GOT_LIST:
			return state.set('list', fromJS(action.data));
		case c.GOT:
			return state.set('selected', fromJS(action.data));
		case c.SET_FORM:
			return state.update(action.form, (formData) => formData.merge(fromJS(action.data)))
		default:
			return state;
	}
}
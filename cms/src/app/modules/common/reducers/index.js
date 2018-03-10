import * as c from '../constant';
import _ from 'lodash';
import { Map } from 'immutable';

const initStateModal = Map({
	isOpen: false,
	content: null,
	title: 'Modal Title',
	modalSize: 'modal-md'
})

export default {
	loading: (state = c.LOADING_INIT_STATE, action) => {
		switch(action.type){
			case c.SET_LOADING:
				let setLoading = state.loadingTypes.concat([action.key]);
				return _.assign({}, state, {
					loadingTypes: setLoading
				})
			case c.DONE_LOADING:
				let doneLoading = state.loadingTypes.filter((type) => !(action.key === type))
				return _.assign({}, state, {
					loadingTypes: doneLoading
				})
			case c.CLEAR_LOADING:
				return _.assign({}, state, {
					loadingTypes: []
				})
			default: 
				return state;
		}
	},
	modal: (state = initStateModal, action) => {
		switch(action.type){
			case c.MODAL:
				return state.merge(Map(action.data))
			default: 
				return state
		}
	}
}

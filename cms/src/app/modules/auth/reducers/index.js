import * as c from '../constants';
import { Map, /*fromJS, List*/ } from 'immutable';

const initState = Map({
	isAuthenticated: false,
})

export default (state = initState, action) => {
	switch(action.type){
		case c.AUTHENTICATE:
			return state.set('isAuthenticated', action.isSuccess);
		default:
			return state;
	}
}
import { all } from 'redux-saga/effects';
import authentication from './modules/auth/sagas';

export default function* (){
	yield all([
		authentication()
		])
}
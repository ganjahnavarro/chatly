import { all } from 'redux-saga/effects';
import authentication from './modules/auth/sagas';
import product from './modules/product/sagas';
import category from './modules/category/sagas';
import branch from './modules/branch/sagas';
import productType from './modules/product_type/sagas';
import attribute from './modules/attribute/sagas';

export default function* (){
	yield all([
		authentication(),
		product(),
		category(),
		branch(),
		productType(),
		attribute()
		])
}
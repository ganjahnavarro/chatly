import { takeEvery, put, call, all } from "redux-saga/effects";
import {
	loading,
	alert,
	history,
	// services,
	// watchApiReponse,
	// moment,
	// loadState,
	_,
	database
} from "../../../Utils";
import * as c from "../constants";

const getCategories = () => {
	const categoriesRef = database.ref(`categories`);
	return new Promise((resolve, reject) => {
		categoriesRef.once("value", snapshot => {
			let categories = []

			_.forOwn(snapshot.val(), (value, key) => {
				categories.push({
					categoryId: key,
					...value
				})
			})

			resolve(categories);
		})
	})
}

const getCategory = (categoryId) => {
	const categoryRef = database.ref(`categories/${categoryId}`);
	return new Promise((resolve, reject) => {
		categoryRef.once("value", snapshot => {
			resolve({
				...snapshot.val(),
				categoryId: categoryId
			});
		})
	})
}

const addCategory = (args) => {
	return new Promise((resolve, reject) => {
		const categoriesRef = database.ref(`categories`);
		categoriesRef.push().set(args, () => {
			resolve('Category successfully added.')
		});
	});
}

const editCategory = (args, categoryId) => {
	return new Promise((resolve, reject) => {
		const categoryRef = database.ref(`categories/${categoryId}`);
		categoryRef.update(args, () => {
			resolve('Product successfully updated.')
		});
	});
}

const deleteCategory = (categoryId) => {
	return new Promise((resolve, reject) => {
		const categoryRef = database.ref(`categories/${categoryId}`);
			categoryRef.remove(() => {
				resolve('Product successfully deleted.')
			});
	});
}

function* getList() {
	yield put(loading("GET_LIST"));

	const response = yield call(getCategories);

	yield put({
		type: c.GOT_LIST,
		data: response
	})

	yield put(loading("GET_LIST", false));
}

function* get({ categoryId }){

	yield put(loading("GET"));

	const response = yield call(getCategory, categoryId);
	
	yield put({
		type: c.GOT,
		data: response
	})

	yield put(loading("GET", false));
}

function* add ({ args }){
	yield put(loading("ADD"));

	const response = yield call(addCategory, args);

	alert.success(response);

	yield all([
		getList(),
		put({
			type: "MODAL",
			data: {
				isOpen: false,
				content: null,
				title: "",
			}
		})
	])
	
	yield put(loading("ADD", false));	
}

function* edit ({ args, categoryId }){
	yield put(loading("EDIT"));

	const response = yield call(editCategory, args, categoryId);

	alert.success(response);

	yield all([
		getList(),
		get({ categoryId: categoryId }),
		put({
			type: "MODAL",
			data: {
				isOpen: false,
				content: null,
				title: "",
			}
		})
	])
	
	yield put(loading("EDIT", false));	
}

function* omit({ categoryId }){
	yield put(loading("DELETE"));

	const response = yield call(deleteCategory, categoryId);

	alert.success(response);

	history.push('/categories');

	yield getList();

	yield put(loading("DELETE", false));
}

export default function*() {
	yield all([
		takeEvery(c.GET_LIST, getList),
		takeEvery(c.GET, get),
		takeEvery(c.ADD, add),
		takeEvery(c.EDIT, edit),
		takeEvery(c.DELETE, omit)
		]);
}

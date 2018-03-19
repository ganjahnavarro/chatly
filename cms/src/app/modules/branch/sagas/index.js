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

const getBranches = () => {
	const branchesRef = database.ref(`branches`);
	return new Promise((resolve, reject) => {
		branchesRef.once("value", snapshot => {
			let branches = []

			_.forOwn(snapshot.val(), (value, key) => {
				branches.push({
					branchId: key,
					...value
				})
			})

			resolve(branches);
		})
	})
}

const getBranch = (branchId) => {
	const branchRef = database.ref(`branches/${branchId}`);
	return new Promise((resolve, reject) => {
		branchRef.once("value", snapshot => {
			resolve({
				...snapshot.val(),
				branchId: branchId
			});
		})
	})
}

const addBranch = (args) => {
	return new Promise((resolve, reject) => {
		const branchesRef = database.ref(`branches`);
		branchesRef.push().set(args, () => {
			resolve('Branch successfully added.')
		});
	});
}

const editBranch = (args, branchId) => {
	return new Promise((resolve, reject) => {
		const branchRef = database.ref(`branches/${branchId}`);
		branchRef.update(args, () => {
			resolve('Branch successfully updated.')
		});
	});
}

const deleteBranch = (branchId) => {
	return new Promise((resolve, reject) => {
		const branchRef = database.ref(`branches/${branchId}`);
			branchRef.remove(() => {
				resolve('Branch successfully deleted.')
			});
	});
}

function* getList() {
	yield put(loading("GET_LIST"));

	const response = yield call(getBranches);
	
	yield put({
		type: c.GOT_LIST,
		data: response
	})

	yield put(loading("GET_LIST", false));
}

function* get({ branchId }){

	yield put(loading("GET"));

	const response = yield call(getBranch, branchId);
	
	yield put({
		type: c.GOT,
		data: response
	})

	yield put(loading("GET", false));
}

function* add ({ args }){
	yield put(loading("ADD"));

	const response = yield call(addBranch, args);

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

function* edit ({ args, branchId }){
	yield put(loading("EDIT"));

	const response = yield call(editBranch, args, branchId);

	alert.success(response);

	yield all([
		getList(),
		get({ branchId: branchId }),
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

function* omit({ branchId }){
	yield put(loading("DELETE"));

	const response = yield call(deleteBranch, branchId);

	alert.success(response);

	history.push('/branches');

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

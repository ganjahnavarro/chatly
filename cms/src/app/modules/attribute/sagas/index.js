import { takeEvery, put, call, all } from "redux-saga/effects";
import {
	loading,
	// alert,
	// history,
	// services,
	// watchApiReponse,
	// moment,
	// loadState,
	_,
	database,
	Promise
} from "../../../Utils";
import * as c from "../constants";

const getAttribute = attributeKey => {
	const attributeRef = database.ref(`attributes/${attributeKey}`);
	return new Promise((resolve, reject) => {
		attributeRef.once("value", snapshot => {
			let values = [];

			_.forOwn(snapshot.val().values, (value, key) => {
				values.push({
					id: key,
					...value
				});
			});

			resolve({
				id: attributeKey,
				values,
				..._.omit(snapshot.val(), ["values"]),
			});
		});
	});
};

const getAttributes = () => {
	const attributesRef = database.ref(`attributes`);
	return new Promise((resolve, reject) => {
		attributesRef.once("value", snapshot => {
			const promises = _.keys(snapshot.val()).map(item => getAttribute(item));
			Promise.all(promises).then(responses => resolve(responses));
		});
	});
};

function* getList() {
	yield put(loading("GET_LIST"));

	const response = yield call(getAttributes);

	yield put({
		type: c.GOT_LIST,
		data: response
	});

	yield put(loading("GET_LIST", false));
}

export default function*() {
	yield all([
		takeEvery(c.GET_LIST, getList)
		// takeEvery(c.GET, get)
		// takeEvery(c.ADD, add),
		// takeEvery(c.EDIT, edit),
		// takeEvery(c.DELETE, omit)
	]);
}

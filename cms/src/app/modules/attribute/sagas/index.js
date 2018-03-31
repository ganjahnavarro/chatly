import { takeEvery, put, call, all } from "redux-saga/effects";
import {
	loading,
	alert,
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

function* get({ attributeId }){
	yield put(loading("GET_LIST"));

	const response = yield call(getAttribute, attributeId);

	yield put({
		type: c.GOT,
		data: response
	});

	yield put(loading("GET_LIST", false));
}

const addAttribute = (args) => {
	return new Promise((resolve, reject) => {
		const attributesRef = database.ref(`attributes`);
		const attributeRef = attributesRef.push();
		const { code, name, values } = args;
		attributeRef.set({ code, name }, () => {
			values.forEach(item => {
				const valuesRef = attributeRef.child("values").push()
				valuesRef.set(item)
			})
		})
		resolve("Attribute successfully added.");
	})
}

function* add({ args }){
	yield put(loading("ADD"));
	const response = yield call(addAttribute, args);
	if(response){
		alert.success(response);
		yield put({
			type: "MODAL",
			data: {
				isOpen: false,
				content: null,
				title: "",
			}
		})
		yield getList()
	}
	yield put(loading("ADD", false));
}

const editAttribute = (args, attributeId) => {
	return new Promise((resolve, reject) => {
		const attributeRef = database.ref(`attributes/${attributeId}`);
		const { code, name, values } = args;
		attributeRef.update({
			code, 
			name
		}, () => {
			values.forEach(item => {
				if(item.id){
					attributeRef.child(`values/${item.id}`)
						.update({
							name: item.name
						})					
				}else{
					attributeRef.child(`values`)
						.push().set({ name: item.name })
				}
			})
			resolve("Attribute successfully updated.")
		})

	})
}

function* edit({ args, attributeId }){
	yield put(loading("EDIT"));
	const response = yield call(editAttribute, args, attributeId);
	if(response){
		alert.success(response);
		yield put({
			type: "MODAL",
			data: {
				isOpen: false,
				content: null,
				title: "",
			}
		})
		yield all([
			getList(),
			get({ attributeId })
			])
	}
	yield put(loading("EDIT", false));
}

export default function*() {
	yield all([
		takeEvery(c.GET_LIST, getList),
		takeEvery(c.GET, get),
		takeEvery(c.ADD, add),
		takeEvery(c.EDIT, edit),
		// takeEvery(c.DELETE, omit)
	]);
}

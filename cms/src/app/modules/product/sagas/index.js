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

export const getCategory = categoryKey => {
	const categoryRef = database.ref(`categories/${categoryKey}`);
	return new Promise((resolve, reject) => {
		categoryRef.once("value", snapshot => {
			resolve({
				...snapshot.val(),
				categoryId: categoryKey
			});
		});
	});
};

const getProducts = () => {
	const productsRef = database.ref(`products`);
	return new Promise((resolve, reject) => {
		productsRef.once("value", snapshot => {
			let categories = [];
			let products = [];

			_.forOwn(snapshot.val(), (value, key) => {
				products.push({
					productId: key,
					...value
				});
				categories.push(value.categoryId);
			});

			const categoryKeys = _.uniq(categories).map(item =>
				getCategory(item)
			);

			Promise.all(categoryKeys).then(categories => {
				let responseData = [];
				products.forEach(product => {
					categories.forEach(category => {
						if (product.categoryId === category.categoryId) {
							responseData.push({
								...product,
								category: category
							});
						}
					});
				});
				resolve(responseData);
			});
		});
	});
};

const getProduct = (productId) => {
	const productRef = database.ref(`products/${productId}`);
	return new Promise((resolve, reject) => {
		productRef.once("value", snapshot => {
			const { categoryId } = snapshot.val();
			getCategory(categoryId)
				.then(res => {
					resolve({
						...snapshot.val(),
						productId: productId,
						category: res
					})
				})
		})
	})
}

const addProduct = (args) => {
	return new Promise((resolve, reject) => {
		const productsRef = database.ref(`products`);
		productsRef.push().set(args, () => {
			resolve('Product successfully added.')
		});
	});
}

const editProduct = (args, productId) => {
	return new Promise((resolve, reject) => {
		const productRef = database.ref(`products/${productId}`);
		productRef.update(args, () => {
			resolve('Product successfully updated.')
		});
	});
}

const deleteProduct = (productId) => {
	return new Promise((resolve, reject) => {
		const productRef = database.ref(`products/${productId}`);
			productRef.remove(() => {
				resolve('Product successfully deleted.')
			});
	});
}

function* getList() {
	yield put(loading("GET_LIST"));

	const response = yield call(getProducts);
	
	yield put({
		type: c.GOT_LIST,
		data: response
	})

	yield put(loading("GET_LIST", false));
}

function* get({ productId }){

	yield put(loading("GET"));

	const response = yield call(getProduct, productId);
	
	yield put({
		type: c.GOT,
		data: response
	})

	yield put(loading("GET", false));
}

function* add ({ args }){
	yield put(loading("ADD"));

	const response = yield call(addProduct, args);

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

function* edit ({ args, productId }){
	yield put(loading("EDIT"));

	const response = yield call(editProduct, args, productId);

	alert.success(response);

	yield all([
		getList(),
		get({ productId: productId }),
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

function* omit({ productId }){
	yield put(loading("DELETE"));

	const response = yield call(deleteProduct, productId);

	alert.success(response);

	history.push('/products');

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

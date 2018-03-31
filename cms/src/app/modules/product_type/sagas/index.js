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
	database,
	Promise
} from "../../../Utils";
import * as c from "../constants";

function cartesian(data) {
    var r = [], arg = data, max = arg.length-1;
    function helper(arr, i) {
        for (var j=0, l=arg[i].length; j<l; j++) {
            var a = arr.slice(0); // clone arr
            a.push(arg[i][j]);
            if (i===max)
                r.push(a);
            else
                helper(a, i+1);
        }
    }
    helper([], 0);
    return r;
}

const getCategory = categoryKey => {
	const categoryRef = database.ref(`categories/${categoryKey}`);
	return new Promise((resolve, reject) => {
		categoryRef.once("value", snapshot => {
			resolve({
				...snapshot.val(),
				id: categoryKey
			});
		});
	});
};

const getAttribute = attribKey => {
	const attribRef = database.ref(`attributes/${attribKey}`);
	return new Promise((resolve, reject) => {
		attribRef.once("value", snapshot => {
			let values = [];
			_.forOwn(snapshot.val().values, (value, key) => {
				values.push({
					...value,
					id: key
				});
			});
			resolve({
				attribute_id: attribKey,
				code: snapshot.val().code,
				name: snapshot.val().name,
				values
			});
		});
	});
};

const getAllAttribValues = data => {
	let values = [];
	data.forEach(item => {
		item.values.forEach(item2 => {
			values.push(item2);
		});
	});
	return values;
};

const formatProducts = (rawProduct, attribValues) => {
	let attribute_values = [];
	_.forOwn(rawProduct.attribute_values, (value, key) => {
		attribValues.forEach(item => {
			if (value.attribute_value_id === item.id) {
				attribute_values.push({
					attribute_value_id: value.attribute_value_id,
					attribute_value: item
				});
			}
		});
	});
	const data = {
		..._.omit(rawProduct, ["attribute_values"]),
		attribute_values
	};

	return data;
};

const getProductType = getProductKey => {
	const productTypeRef = database.ref(`product_types/${getProductKey}`);
	return new Promise((resolve, reject) => {
		productTypeRef.once("value", snapshot => {
			const rawAttributes = snapshot.val().attributes || {};
			const rawProducts = snapshot.val().products || {};
			const newData = _.omit(snapshot.val(), ["attributes", "products"]);

			let promises = [];
			_.forOwn(rawAttributes, (value, key) =>
				promises.push(getAttribute(value.attribute_id))
			);

			Promise.all(promises).then(responses => {
				let products = [];
				const values = getAllAttribValues(responses);

				_.forOwn(rawProducts, (rawProduct, key) => {
					const formatted = formatProducts(rawProduct, values)
					products.push({
						id: key,
						...formatted
					});
				});

				getCategory(newData.category_id).then(res => {
					resolve({
						...newData,
						products,
						attributes: responses,
						id: getProductKey,
						category: res
					});
				});
			});
		});
	});
};

const getProductTypes = () => {
	const productTypesRef = database.ref(`product_types`);
	return new Promise((resolve, reject) => {
		productTypesRef.once("value", snapshot => {
			const keys = _.keys(snapshot.val());
			const promises = keys.map(item => getProductType(item));

			Promise.all(promises).then(responses => resolve(responses));
		});
	});
};

const addChild = (args, productTypeRef) => {
	return new Promise((resolve, reject) => {
		args.attributes.forEach(item => {
			productTypeRef.child("attributes").push().set({
				attribute_id: item
			})
		})

		let products = []

		let rawAttribValues = []
		args.attribValues.forEach(item => {
			let values = [];
			item.values.forEach(item2 => {
				values.push(item2.id)
			})
			rawAttribValues.push(values)
		})
		const attribValues = cartesian(rawAttribValues)

		attribValues.forEach(item => {
			let attribute_values = []
			item.forEach(item2 => {
				attribute_values.push({
					attribute_value_id: item2
				})
			})
			products.push({
				attribute_values,
				description: "",
				price: args.price
			})
		})

		products.forEach(item => {
			const productsRef = productTypeRef.child("products").push()
			productsRef.set({
				..._.omit(item, ['attribute_values'])
			})
			item.attribute_values.forEach(item2 => {
				productsRef.child("attribute_values").push().set({
					attribute_value_id: item2.attribute_value_id
				})
			})
		})
		resolve();
	})
}

const addProductType = (args) => {
	return new Promise((resolve, reject) => {
		const productTypesRef = database.ref(`product_types`);
		const productTypeRef = productTypesRef.push();

		const { category_id, image_url, name, description, price } = args

		productTypeRef.set({
			category_id,
			image_url, 
			name,
			description,
			price
		})
		
		addChild(args, productTypeRef)
			.then(res => {
				resolve("Product type successfuly added.")
			})
	})
}

const editProductType = (args, key) => {
	return new Promise((resolve, reject) => {
		const productTypeRef = database.ref(`product_types/${key}`);

		const { category_id, image_url, name, description, price } = args

		productTypeRef.update({
			category_id,
			image_url, 
			name,
			description,
			price
		})
		
		productTypeRef.child("attributes").remove(() => {
			productTypeRef.child("products").remove(() => {
				addChild(args, productTypeRef)
					.then(res => {
						resolve("Product type successfuly updated.")
					})
			})
		})
	})
}

const deleteProductType = (key) => {
	return new Promise((resolve, reject) => {
		const productTypeRef = database.ref(`product_types/${key}`);
		productTypeRef.remove(() => {
			resolve('Product successfully deleted.')
		});
	})
}

const editProductRef = (args, productTypeId) => {
	return new Promise((resolve, reject) => {
		const { description, price, id } = args
		const productRef = database.ref(`product_types/${productTypeId}/products/${id}`);
		productRef.update({
			description,
			price
		}, () => resolve("Product successfully updated.")
		)
	})
}

function* getList() {
	yield put(loading("GET_LIST"));

	const response = yield call(getProductTypes);

	yield put({
		type: c.GOT_LIST,
		data: response
	});

	yield put(loading("GET_LIST", false));
}

function* get({ id }) {
	yield put(loading("GET"));

	const response = yield call(getProductType, id);

	yield put({
		type: c.GOT,
		data: response
	});

	yield put(loading("GET", false));
}


function* add({ args }) {
	yield put(loading("ADD"));

	const response = yield call(addProductType, args)

	if(response){
		alert.success(response)

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

function* edit({ args, key }){
	yield put(loading("EDIT"));

	const response = yield call(editProductType, args, key)

	if(response){
		alert.success(response)

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
			get({ id: key })
		])
	}

	yield put(loading("EDIT", false));
}

function* omit({ key }){
	yield put(loading("DELETE"));

	const response = yield call(deleteProductType, key);

	alert.success(response);

	history.push('/product-types');

	yield getList();

	yield put(loading("DELETE", false));
}

function* editProduct({ args, productTypeId }){
	yield put(loading("EDIT_PRODUCT"));

	const response = yield call(editProductRef, args, productTypeId);

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

		yield get({ id: productTypeId })
	}


	yield put(loading("EDIT_PRODUCT", false));
}

export default function*() {
	yield all([
		takeEvery(c.GET_LIST, getList),
		takeEvery(c.GET, get),
		takeEvery(c.ADD, add),
		takeEvery(c.EDIT, edit),
		takeEvery(c.DELETE, omit),
		takeEvery(c.EDIT_PRODUCT, editProduct)
	]);
}

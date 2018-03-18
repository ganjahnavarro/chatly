import * as admin from 'firebase-admin'
import * as firebase from 'firebase'
import * as functions from 'firebase-functions'
import Promise from 'promise'

admin.initializeApp(functions.config().firebase)
firebase.initializeApp(functions.config().firebase)

export const database = firebase.database()

export const saveUserDetails = (senderId, data) => {
    database.ref(`users/${senderId}`).set(data)
}

export const getBranches = () => getItems('branches')
export const getCategories = () => getItems('categories')
export const getProducts = () => getItems('products')

const getItems = key => {
    return new Promise((resolve, reject) => {
        database.ref(key).once('value', snapshot => {
            const val = snapshot.val()
            const ids = Object.keys(val)

            const items = ids.map(id => {
                return { id, ...val[id] }
            })
            resolve(items)
        })
    })
}

export const getCategory = categoryKey => {
    const categoryRef = database.ref(`categories/${categoryKey}`)
    return new Promise((resolve, reject) => {
        categoryRef.once('value', snapshot => {
            resolve(snapshot.val())
        })
    })
}

export const getProduct = productKey => {
    const productsRef = database.ref(`products/${productKey}`)
    return new Promise((resolve, reject) => {
        productsRef.once('value', snapshot => {
            const { categoryId } = snapshot.val()
            getCategory(categoryId).then(res => {
                resolve({
                    ...snapshot.val(),
                    category: res
                })
            })
        })
    })
}

export const getCartItem = (senderId, itemId) => {
    const sessionRef = database.ref(
        `sessions/${senderId}/cart/${itemId}`
    )

    return new Promise((resolve, reject) => {
        sessionRef.once('value', snapshot => {
            const { product } = snapshot.val()
            getProduct(product).then(res => {
                resolve({
                    ...snapshot.val(),
                    product: res,
                    id: itemId
                })
            })
        })
    })
}

export const getCartItems = senderId => {
    const cartRef = database.ref(`sessions/${senderId}/cart`)

    return new Promise((resolve, reject) => {
        cartRef.once('value', snapshot => {
            let promises = []

            const keys = Object.keys(snapshot.val())
            keys.forEach(key => promises.push(getCartItem(senderId, key)))

            Promise.all(promises).then(items => resolve(items))
        })
    })
}

export const removeCartItem = (senderId, product) => {
    const cartRef = database.ref(`sessions/${senderId}/cart`)

    return new Promise((resolve, reject) => {
        getCartItems(senderId).then(items => {
            items.forEach(item => {
                if (item.product.name.toLowerCase() === product.toLowerCase()) {
                    console.log(`Removing cart ID: ${item.id}`)
                    cartRef.child(item.id).remove()
                }
            })
            resolve()
        })
    })
}

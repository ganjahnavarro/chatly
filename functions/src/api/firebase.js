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

export const getBranches = () => {
    return new Promise((resolve, reject) => {
        database.ref('branches').once('value', snapshot => resolve(snapshot.val()))
    })
}

export const getCategories = () => {
    return new Promise((resolve, reject) => {
        database.ref('categories').once('value', snapshot => resolve(snapshot.val()))
    })
}

export const getProducts = () => {
    return new Promise((resolve, reject) => {
        database.ref('products').once('value', snapshot => {
            const productSnapshot = snapshot.val()
            const ids = Object.keys(productSnapshot)

            console.log('Product ids: ', ids)

            const products = ids.map(id => {
                return { id, ...productSnapshot[id] }
            })

            console.log('Products: ', products)

            resolve(products)
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

import * as admin from 'firebase-admin'
import * as firebase from 'firebase'

const functions = require('firebase-functions')

admin.initializeApp(functions.config().firebase)
firebase.initializeApp(functions.config().firebase)

export const database = firebase.database()

export const saveUserDetails = (senderId, data) => {
    database.ref(`users/${senderId}`).set(data)
}

export const getCategories = categoryKey => {
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
            getCategories(categoryId).then(res => {
                resolve({
                    ...snapshot.val(),
                    category: res
                })
            })
        })
    })
}

import * as admin from 'firebase-admin'
import * as firebase from 'firebase'

const functions = require('firebase-functions')

admin.initializeApp(functions.config().firebase)
firebase.initializeApp(functions.config().firebase)

export const database = firebase.database()

export const saveUserDetails = (senderId, data) => {
    database.ref(`users/${senderId}`).set(data)
}

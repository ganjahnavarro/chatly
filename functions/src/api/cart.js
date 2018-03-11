import * as functions from 'firebase-functions'
const admin = require('firebase-admin')

admin.initializeApp(functions.config().firebase)

export default admin

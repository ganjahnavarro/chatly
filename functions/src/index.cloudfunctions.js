'use strict'

import * as functions from 'firebase-functions'
import { createEntity, getIntent, updateIntent } from './api/dialogflow'
import Controller from './controller'

exports.dialogflowFulfillment = functions.https.onRequest((request, response) => Controller.handle(request, response))

exports.addDialogflowEntityAndIntent = functions.database
    .ref('/attributes/{pushId}')
    .onCreate(event => {
        const attribute = event.data.val()

        attribute.code = `attr-${sanitize(attribute.name)}`
        const getDiaglogflowIntent = getIntent()

        getDiaglogflowIntent.then(oldIntent => {
            const updateDialogflowEntity = createEntity(attribute)
            const updateDialogflowIntent = updateIntent(oldIntent, attribute)
            const updateDatabase = event.data.ref.set(attribute)

            return Promise.all([updateDatabase, updateDialogflowEntity, updateDialogflowIntent])
                .then((responses) => console.log('Success!', JSON.stringify(responses)))
                .catch(err => console.log('Error', JSON.stringify(err)))
        })
    })

function sanitize (name) {
    return name.replace(/\s+/g, '-').toLowerCase()
}

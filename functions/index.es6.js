'use strict'

const functions = require('firebase-functions')

const messages = {
    welcome: 'Welcome to chatly!',
    default: 'Sorry I don\'t understand'
}

exports.dialogflowFulfillment = functions.https.onRequest((request, response) => {
    console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers))
    console.log('Dialogflow Request body: ' + JSON.stringify(request.body))

    if (request.body.queryResult) {
        processRequest(request, response)
    } else {
        console.log('Invalid Request')
        return response.status(400).end('Invalid Webhook Request (expecting v2 webhook request)')
    }
})

function sendResponse ({ responseToUser, response }) {
    if (typeof responseToUser === 'string') {
        let responseJson = {fulfillmentText: responseToUser}
        response.json(responseJson)
    } else {
        let responseJson = {}
        responseJson.fulfillmentText = responseToUser.fulfillmentText

        if (responseToUser.fulfillmentMessages) {
            responseJson.fulfillmentMessages = responseToUser.fulfillmentMessages
        }

        if (responseToUser.outputContexts) {
            responseJson.outputContexts = responseToUser.outputContexts
        }

        console.log('Response to Dialogflow: ' + JSON.stringify(responseJson))
        response.json(responseJson)
    }
}

const onWelcome = (args) => {
    sendResponse({ responseToUser: messages.welcome, ...args })
}

const onDefault = (args) => {
    let responseToUser = { fulfillmentText: messages.default }
    sendResponse({ responseToUser, ...args })
}

const actionHandlers = {
    'input.welcome': onWelcome,
    'default': onDefault
}

function processRequest (request, response) {
    let action = (request.body.queryResult.action) ? request.body.queryResult.action : 'default'
    let parameters = request.body.queryResult.parameters || {}
    let inputContexts = request.body.queryResult.contexts
    let requestSource = (request.body.originalDetectIntentRequest) ? request.body.originalDetectIntentRequest.source : undefined
    let session = (request.body.session) ? request.body.session : undefined

    const handler = actionHandlers[action] || actionHandlers['default']
    const args = { action, parameters, inputContexts, requestSource, session, response }
    handler(args)
}

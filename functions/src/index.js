'use strict'

const functions = require('firebase-functions')
const { getUserDetails } = require('./api/messenger')

let tempCart = []

const messages = {
    'welcome': 'Welcome to chatly!',
    'default': 'Sorry I don\'t understand'
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
        let responseJson = { fulfillmentText: responseToUser }
        response.json(responseJson)
    } else {
        console.log('Response to Dialogflow: ' + JSON.stringify(responseToUser))
        response.json(responseToUser)
    }
}

const onWelcome = (args) => {
    const { payloadData } = args

    console.log(args)

    if (payloadData.sender && payloadData.sender.id) {
        getUserDetails(payloadData.sender.id)
    }

    sendResponse({ responseToUser: messages.welcome, ...args })
}

const onOrderStart = (args) => {
    const { parameters } = args
    const { quantity, product } = parameters

    tempCart.push({ quantity, product })

    const message = `OK, ${quantity} ${product} added to your cart. Anything else?`
    sendResponse({ responseToUser: message, ...args })
}

const onShowCart = (args) => {
    sendResponse({ responseToUser: JSON.stringify(tempCart), ...args })
}

const onClearCart = (args) => {
    tempCart = []
    sendResponse({ responseToUser: 'Cart cleared.', ...args })
}

const onAskLocation = (args) => {
    const fulfillmentText = 'In what address you want this order to be delivered?'
    const payload = {
        facebook: {
            text: fulfillmentText,
            quick_replies: [
                {
                    content_type: 'location'
                }
            ]
        }
    }
    let responseToUser = { fulfillmentText, payload }
    sendResponse({ responseToUser, ...args })
}

const onReceiveLocation = (args) => {
    const { payloadData } = args
    if (payloadData && payloadData.postback && payloadData.postback.data) {
        const { lat, long } = payloadData.postback.data
        sendResponse({ responseToUser: `Location received. Lat: ${lat}, Long: ${long}.`, ...args })
    } else {
        console.error('Invalid state. Payload Data: ' + JSON.stringify(payloadData))
    }
}

const onDefault = (args) => {
    let responseToUser = { fulfillmentText: messages.default }
    sendResponse({ responseToUser, ...args })
}

const actionHandlers = {
    'order.product': onOrderStart,
    'order.show.cart': onShowCart,
    'order.clear.cart': onClearCart,

    'order.additional.no': onAskLocation,
    'order.receive.location': onReceiveLocation,

    'default.welcome': onWelcome,
    'default.fallback': onDefault
}

function processRequest (request, response) {
    const defaultAction = 'default.fallback'

    let action = (request.body.queryResult.action) ? request.body.queryResult.action : defaultAction
    let parameters = request.body.queryResult.parameters || {}
    let inputContexts = request.body.queryResult.contexts
    let session = (request.body.session) ? request.body.session : undefined

    const originalRequest = request.body.originalDetectIntentRequest
    let payloadData = (originalRequest && originalRequest.payload) ? originalRequest.payload.data : undefined

    const handler = actionHandlers[action] || actionHandlers[defaultAction]
    const args = { action, parameters, inputContexts, session, payloadData, response }

    handler(args)
}

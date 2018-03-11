'use strict'

import functions from 'firebase-functions'
// import { getUserDetails } from './api/messenger'
import onWelcome from './modules/default/onWelcome'
import onDefault from './modules/default/onDefault'
import onAskLocation from './modules/location/onAskLocation'
import onReceiveLocation from './modules/location/onReceiveLocation'
import onClearCart from './modules/cart/onClearCart'
import onShowCart from './modules/cart/onShowCart'
import onOrderStart from './modules/order/onOrderStart'
import quickReply from './modules/quick-reply/quickReply'

// let tempCart = []

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

const actionHandlers = {
    'order.product': onOrderStart,
    'order.show.cart': onShowCart,
    'order.clear.cart': onClearCart,

    'order.additional.no': onAskLocation,
    'order.receive.location': onReceiveLocation,

    'sample.quick.reply': quickReply,

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

    handler(args, sendResponse)
}

'use strict'

import * as functions from 'firebase-functions'

import onWelcome from './modules/default/onWelcome'
import onDefault from './modules/default/onDefault'

import onReceiveLocation from './modules/location/onReceiveLocation'

import onAskDeliveryType from './modules/delivery-type/onAskDeliveryType'
import onDeliveryTypeChange from './modules/delivery-type/onDeliveryTypeChange'

import onClearCart from './modules/cart/onClearCart'
import onShowCart from './modules/cart/onShowCart'

import onOrderStart from './modules/order/onOrderStart'

import sampleQuickReply from './modules/sample/quickReply'

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

    'order.additional.no': onAskDeliveryType,
    'order.receive.location': onReceiveLocation,

    'order.delivery.type.change': onDeliveryTypeChange,

    'default.welcome': onWelcome,
    'default.fallback': onDefault,

    'sample.quick.reply': sampleQuickReply
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

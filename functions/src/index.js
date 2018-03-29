'use strict'

import * as functions from 'firebase-functions'

import populateDatabase from './api/populate'

import onWelcome from './modules/default/onWelcome'
import onDefault from './modules/default/onDefault'

import onReceiveLocation from './modules/location/onReceiveLocation'

import onDeliveryTypeChange from './modules/delivery-type/onDeliveryTypeChange'

import onBranchChange from './modules/branch/onBranchChange'
import onPhoneNumberChange from './modules/user/onPhoneNumberChange'

import onOrderContinue from './modules/order/onOrderContinue'
import onOrderConfirm from './modules/order/onOrderConfirm'

import onShowMenu from './modules/product/onShowMenu'

import onClearCart from './modules/cart/onClearCart'
import onShowCart from './modules/cart/onShowCart'
// import onAddCartItem from './modules/cart/onAddCartItem'
import onRemoveCartItem from './modules/cart/onRemoveCartItem'
import onRemoveCartItemById from './modules/cart/onRemoveCartItemById'

import sampleQuickReply from './modules/sample/quickReply'

import onAddProduct2 from './modules/order/onAddProduct2'

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
    // 'order.product.add': onAddCartItem,
    // 'order.product.select.option': onAddCartItem,
    'order.product.remove': onRemoveCartItem,
    'order.product.remove.by.id': onRemoveCartItemById,

    'order.show.cart': onShowCart,
    'order.clear.cart': onClearCart,

    'order.additional.no': onOrderContinue,
    'order.receive.location': onReceiveLocation,

    'order.delivery.type.change': onDeliveryTypeChange,
    'order.phone.number.change': onPhoneNumberChange,
    'order.branch.change': onBranchChange,

    'order.show.menu': onShowMenu,

    'order.confirm': onOrderConfirm,

    'default.welcome': onWelcome,
    'default.fallback': onDefault,

    'sample.quick.reply': sampleQuickReply,
    'order.product.add': onAddProduct2,
    'order.product.add-option': onAddProduct2
}

function processRequest (request, response) {
    const defaultAction = 'default.fallback'

    let action = (request.body.queryResult.action) ? request.body.queryResult.action : defaultAction
    let queryText = request.body.queryResult.queryText
    let parameters = request.body.queryResult.parameters || {}
    let inputContexts = request.body.queryResult.contexts
    let session = (request.body.session) ? request.body.session : undefined

    const originalRequest = request.body.originalDetectIntentRequest
    const payloadData = (originalRequest && originalRequest.payload) ? originalRequest.payload.data : undefined
    const senderId = payloadData && payloadData.sender ? payloadData.sender.id : undefined

    const handler = actionHandlers[action] || actionHandlers[defaultAction]
    const args = { action, parameters, inputContexts, session, payloadData, response, senderId, queryText }

    handler(args, sendResponse)
}

populateDatabase()

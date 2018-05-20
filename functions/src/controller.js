'use strict'

import api from './api'

import onWelcome from './modules/default/onWelcome'
import onDefault from './modules/default/onDefault'

import onAskLocation from './modules/location/onAskLocation'
import onReceiveCoordinates from './modules/location/onReceiveCoordinates'

import onDeliveryTypeChange from './modules/delivery-type/onDeliveryTypeChange'

import onAddPromoCode from './modules/discount/onAddPromoCode'

import onBranchChange from './modules/branch/onBranchChange'
import onPhoneNumberChange from './modules/customer/onPhoneNumberChange'

import onOrderContinue from './modules/order/onOrderContinue'
import onOrderConfirm from './modules/order/onOrderConfirm'
import onOrderCancel from './modules/order/onOrderCancel'
import onOrderTrack from './modules/order/onOrderTrack'

import onSendReceipt from './modules/order/onSendReceipt'

import onShowMenu from './modules/product/onShowMenu'

import onClearCart from './modules/cart/onClearCart'
import onShowCart from './modules/cart/onShowCart'
import onAddCartItem from './modules/cart/onAddCartItem'
import onRemoveCartItem from './modules/cart/onRemoveCartItem'
import onRemoveCartItemById from './modules/cart/onRemoveCartItemById'

import onChangeQuantity from './modules/cart/onChangeQuantity'

import onMultipleResponse from './modules/sample/onMultipleResponse'
import onPay from './modules/sample/onPay'

const { recordRequest, recordResponse } = api

const Controller = {}

function sendResponse ({ responseToCustomer, response, senderId, timestamp }) {
    const isString = typeof responseToCustomer === 'string'
    const responseJson = isString ? { fulfillmentText: responseToCustomer } : responseToCustomer

    console.log('Response to Dialogflow: ' + JSON.stringify(responseJson))
    recordResponse(senderId, timestamp, responseJson)

    response.json(responseJson)
}

const actionHandlers = {
    'order.product.remove': onRemoveCartItem,
    'order.product.remove.by.id': onRemoveCartItemById,

    'order.show.cart': onShowCart,
    'order.clear.cart': onClearCart,

    'order.additional.no': onOrderContinue,
    'order.continue': onOrderContinue,

    'order.address.change': onAskLocation,
    'order.receive.coordinates': onReceiveCoordinates,

    'order.promo.code.change': onAddPromoCode,
    'order.delivery.type.change': onDeliveryTypeChange,
    'order.phone.number.change': onPhoneNumberChange,
    'order.branch.change': onBranchChange,

    'order.show.menu': onShowMenu,

    'order.cancel': onOrderCancel,
    'order.track': onOrderTrack,
    'order.confirm': onOrderConfirm,
    'order.view.receipt': onSendReceipt,

    'default.welcome': onWelcome,
    'default.fallback': onDefault,

    'order.product.add': onAddCartItem,
    'order.product.add-option': onAddCartItem,
    'order.change.quantity': onChangeQuantity,

    'sample.multiple.response': onMultipleResponse,
    'sample.pay': onPay
}

function processRequest (request, response) {
    const defaultAction = 'default.fallback'

    let action = (request.body.queryResult.action) ? request.body.queryResult.action : defaultAction
    let queryText = request.body.queryResult.queryText
    let parameters = request.body.queryResult.parameters || {}
    let contexts = request.body.queryResult.outputContexts
    let session = (request.body.session) ? request.body.session : undefined

    const originalRequest = request.body.originalDetectIntentRequest
    let payloadData = (originalRequest && originalRequest.payload) ? originalRequest.payload.data : undefined

    const senderId = payloadData && payloadData.sender ? payloadData.sender.id : undefined
    const timestamp = payloadData ? payloadData.timestamp : undefined

    if (payloadData) {
        payloadData.supportsLocationQuickReply = payloadData.message && payloadData.message.tags
            ? payloadData.message.tags.source !== 'customer_chat_plugin' : true
    }

    const handler = actionHandlers[action] || actionHandlers[defaultAction]
    const args = { action, parameters, contexts, session, payloadData, response, senderId, timestamp, queryText }

    recordRequest(request, args)
    handler(args, sendResponse)
}

Controller.handle = (request, response) => {
    console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers))
    console.log('Dialogflow Request body: ' + JSON.stringify(request.body))

    if (request.body.queryResult) {
        processRequest(request, response)
    } else {
        console.log('Invalid Request')
        return response.status(400).end('Invalid Webhook Request (expecting v2 webhook request)')
    }
}

export default Controller

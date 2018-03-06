'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var functions = require('firebase-functions');

var tempCart = [];

var messages = {
    'welcome': 'Welcome to chatly!',
    'default': 'Sorry I don\'t understand'
};

exports.dialogflowFulfillment = functions.https.onRequest(function (request, response) {
    console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
    console.log('Dialogflow Request body: ' + JSON.stringify(request.body));

    if (request.body.queryResult) {
        processRequest(request, response);
    } else {
        console.log('Invalid Request');
        return response.status(400).end('Invalid Webhook Request (expecting v2 webhook request)');
    }
});

function sendResponse(_ref) {
    var responseToUser = _ref.responseToUser,
        response = _ref.response;

    if (typeof responseToUser === 'string') {
        var responseJson = { fulfillmentText: responseToUser };
        response.json(responseJson);
    } else {
        var _responseJson = {};
        _responseJson.fulfillmentText = responseToUser.fulfillmentText;

        if (responseToUser.fulfillmentMessages) {
            _responseJson.fulfillmentMessages = responseToUser.fulfillmentMessages;
        }

        if (responseToUser.outputContexts) {
            _responseJson.outputContexts = responseToUser.outputContexts;
        }

        console.log('Response to Dialogflow: ' + JSON.stringify(_responseJson));
        response.json(_responseJson);
    }
}

var onWelcome = function onWelcome(args) {
    sendResponse(_extends({ responseToUser: messages.welcome }, args));
};

var onOrderStart = function onOrderStart(args) {
    var parameters = args.parameters;
    var quantity = parameters.quantity,
        product = parameters.product;


    tempCart.push({ quantity: quantity, product: product });

    var message = 'OK, ' + quantity + ' ' + product + ' added to your cart. Anything else?';
    sendResponse(_extends({ responseToUser: message }, args));
};

var onShowCart = function onShowCart(args) {
    sendResponse(_extends({ responseToUser: JSON.stringify(tempCart) }, args));
};

var onDefault = function onDefault(args) {
    var responseToUser = { fulfillmentText: messages.default };
    sendResponse(_extends({ responseToUser: responseToUser }, args));
};

var actionHandlers = {
    'order.product': onOrderStart,
    'order.show.cart': onShowCart,
    'default.welcome': onWelcome,
    'default.fallback': onDefault
};

function processRequest(request, response) {
    var defaultAction = 'default.fallback';

    var action = request.body.queryResult.action ? request.body.queryResult.action : defaultAction;
    var parameters = request.body.queryResult.parameters || {};
    var inputContexts = request.body.queryResult.contexts;
    var requestSource = request.body.originalDetectIntentRequest ? request.body.originalDetectIntentRequest.source : undefined;
    var session = request.body.session ? request.body.session : undefined;

    var handler = actionHandlers[action] || actionHandlers[defaultAction];
    var args = { action: action, parameters: parameters, inputContexts: inputContexts, requestSource: requestSource, session: session, response: response };
    handler(args);
}

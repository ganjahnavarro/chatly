import api from '../../api'

const { updateCartItemQuantity } = api

export default (args, sendResponse) => {
    const { session, senderId, parameters, contexts } = args
    const { quantity } = parameters

    if (!quantity) {
        const message = 'How many?'

        const outputContexts = [
            {
                name: `${session}/contexts/quantity-onchange`,
                lifespanCount: 1,
                parameters: parameters
            }
        ]

        const responseToCustomer = {
            fulfillmentText: message,
            outputContexts
        }

        sendResponse({ responseToCustomer, ...args })
    } else {
        const filterContext = contexts.filter(item => item.name === `${session}/contexts/quantity-onchange`)
        const cartItem = filterContext[0].parameters['cart-item']
        const name = filterContext[0].parameters['name']

        updateCartItemQuantity(senderId, cartItem, quantity)
        sendResponse({ responseToCustomer: `${name} quantity updated.`, ...args })
    }
}

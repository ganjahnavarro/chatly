import api from '../../api'

const { updateCartItem } = api

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

        const responseToUser = {
            fulfillmentText: message,
            outputContexts
        }

        sendResponse({ responseToUser, ...args })
    } else {
        const filterContext = contexts.filter(item => item.name === `${session}/contexts/quantity-onchange`)
        const cartItem = filterContext[0].parameters['cart-item']
        const name = filterContext[0].parameters['name']

        updateCartItem(senderId, cartItem, { quantity })
        sendResponse({ responseToUser: `${name} quantity updated.`, ...args })
    }
}

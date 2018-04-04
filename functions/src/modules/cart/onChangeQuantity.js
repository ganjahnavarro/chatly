import { database } from '../../api/firebase'
import Promise from 'promise'

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

        const cartRef = database.ref(`sessions/${senderId}/cart/${cartItem}`)

        getCart(cartRef, senderId, cartItem).then(res => {
            cartRef.update({
                ...res,
                quantity: quantity
            })

            const message = `${name} quantity updated.`
            sendResponse({ responseToUser: message, ...args })
        })
    }
}

const getCart = (cartRef, senderId, cartItem) => {
    return new Promise((resolve, reject) => {
        cartRef.once('value', snapshot => {
            resolve(snapshot.val())
        })
    })
}

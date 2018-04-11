import onShowCart from './onShowCart'
import api from '../../api'

const { removeCartItemById } = api

export default (args, sendResponse) => {
    const { senderId, parameters } = args
    const cartItem = getParsedCartItem(args)

    console.log('onRemoveCartItemById', parameters['cart-item'], getParsedCartItem(args))

    if (senderId && cartItem) {
        removeCartItemById(senderId, cartItem).then(() => onShowCart(args, sendResponse))
    } else {
        console.error('Invalid state: ' + JSON.stringify(args))
    }
}

const getParsedCartItem = (args) => {
    const { queryText } = args
    const payloadFormat = 'Remove Cart Item: '

    let parsedCartItem
    if (queryText.indexOf(payloadFormat) === 0) {
        parsedCartItem = queryText.replace(payloadFormat, '')
    }
    return parsedCartItem
}

import { removeCartItem } from '../../api/firebase'

export default (args, sendResponse) => {
    const { senderId, parameters } = args
    const { product } = parameters

    if (senderId && product) {
        removeCartItem(senderId, product).then(() => {
            sendResponse({ responseToUser: `Item successfuly removed from cart.`, ...args })
        })
    } else {
        console.error('Invalid state: ' + JSON.stringify(args))
    }
}

import onShowCart from './onShowCart'
import { removeCartItem } from '../../api/firebase'

export default (args, sendResponse) => {
    const { senderId, parameters } = args
    const productType = parameters['product-type']

    if (senderId && productType) {
        removeCartItem(senderId, productType).then(() => onShowCart(args, sendResponse))
    } else {
        console.error('Invalid state: ' + JSON.stringify(args))
    }
}

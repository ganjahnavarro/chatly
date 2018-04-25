import onShowCart from './onShowCart'
import api from '../../api'

const { removeCartItem } = api

export default (args, sendResponse) => {
    const { senderId, parameters } = args
    const productType = parameters['product-type']

    if (senderId && productType) {
        const onRemoveSuccess = () => onShowCart(args, sendResponse)
        removeCartItem(senderId, productType).then(onRemoveSuccess)
    } else {
        console.error('Invalid state: ' + JSON.stringify(args))
    }
}

import { database } from '../../api/firebase'
import onOrderContinue from '../order/onOrderContinue'

export default (args, sendResponse) => {
    const { parameters, senderId } = args
    const deliveryType = parameters['delivery-type']

    if (senderId && deliveryType) {
        database.ref(`users/${senderId}`).update({ delivery_type: deliveryType })
    }

    onOrderContinue(args, sendResponse)
}

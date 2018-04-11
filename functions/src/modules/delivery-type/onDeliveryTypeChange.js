import onAskDeliveryType from './onAskDeliveryType'
import onOrderContinue from '../order/onOrderContinue'
import api from '../../api'

const { database } = api

export default (args, sendResponse) => {
    const { parameters, senderId } = args
    const deliveryType = parameters['delivery-type']

    if (senderId) {
        if (!deliveryType) {
            onAskDeliveryType(args, sendResponse)
            return
        }

        database.ref(`users/${senderId}`).update({ delivery_type: deliveryType })
        onOrderContinue(args, sendResponse)
    }
}

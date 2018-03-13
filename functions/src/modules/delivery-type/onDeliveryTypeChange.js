import { database } from '../../api/firebase'
import onAskLocation from '../location/onAskLocation'

export default (args, sendResponse) => {
    const { parameters, senderId } = args
    const deliveryType = parameters['delivery-type']

    if (senderId && deliveryType) {
        database.ref(`sessions/${senderId}`).update({ delivery_type: deliveryType })
    }

    onAskLocation(args, sendResponse)
}

import { database } from '../../api/firebase'
import onAskLocation from '../location/onAskLocation'

export default (args, sendResponse) => {
    const { parameters, payloadData } = args
    const deliveryType = parameters['delivery-type']

    if (payloadData.sender && payloadData.sender.id && deliveryType) {
        const senderId = payloadData.sender.id
        database.ref(`sessions/${senderId}`).update({ deliveryType })
    }

    onAskLocation(args, sendResponse)
}

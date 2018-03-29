import { database } from '../../api/firebase'

import onAskContactNumber from './onAskContactNumber'
import onOrderContinue from '../order/onOrderContinue'

export default (args, sendResponse) => {
    const { parameters, senderId } = args
    const phoneNumber = parameters['phone-number']

    if (senderId) {
        if (!phoneNumber) {
            onAskContactNumber(args, sendResponse)
            return
        }

        database.ref(`users/${senderId}`).update({ phone_number: phoneNumber })
        onOrderContinue(args, sendResponse)
    }
}

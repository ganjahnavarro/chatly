import { database } from '../../api/firebase'
import onAskConfirmation from '../order/onAskConfirmation'

export default (args, sendResponse) => {
    const { parameters, senderId } = args
    const phoneNumber = parameters['phone-number']

    if (senderId && phoneNumber) {
        database.ref(`sessions/${senderId}`).update({ phone_number: phoneNumber })
    }

    onAskConfirmation(args, sendResponse)
}

import onAskContactNumber from './onAskContactNumber'
import onOrderContinue from '../order/onOrderContinue'
import api from '../../api'

const { updateUserDetails } = api

export default (args, sendResponse) => {
    const { parameters, senderId } = args
    const phoneNumber = parameters['phone-number']

    if (senderId) {
        if (!phoneNumber) {
            onAskContactNumber(args, sendResponse)
            return
        }

        updateUserDetails(senderId, { phone_number: phoneNumber })
        onOrderContinue(args, sendResponse)
    }
}

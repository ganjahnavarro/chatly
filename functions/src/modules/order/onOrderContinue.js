import { database } from '../../api/firebase'

import onAskBranch from '../branch/onAskBranch'
import onAskLocation from '../location/onAskLocation'
import onAskDeliveryType from '../delivery-type/onAskDeliveryType'
import onAskContactNumber from '../user/onAskContactNumber'
import onAskConfirmation from '../order/onAskConfirmation'

export default (args, sendResponse) => {
    const { senderId } = args

    if (senderId) {
        database.ref(`users/${senderId}`).once('value').then(snapshot => {
            const user = snapshot.val()
            const {
                branch,
                delivery_type: deliveryType,
                phone_number: phoneNumber,
                location
            } = user

            if (!deliveryType) {
                onAskDeliveryType(args, sendResponse)
                return
            }

            if (!location) {
                onAskLocation(args, sendResponse)
                return
            }

            if (deliveryType === 'pick-up') {
                if (!branch) {
                    onAskBranch(args, sendResponse)
                    return
                }
            }

            if (!phoneNumber) {
                onAskContactNumber(args, sendResponse)
                return
            }

            onAskConfirmation(args, sendResponse)
        })
    }
}

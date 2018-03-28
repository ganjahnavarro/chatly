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

            console.log('On order continue: ', JSON.stringify(user))

            if (!deliveryType) {
                console.log('On order continue: onAskDeliveryType.')
                onAskDeliveryType(args, sendResponse)
                return
            }

            if (!location) {
                console.log('On order continue: onAskLocation.')
                onAskLocation(args, sendResponse)
                return
            }

            if (deliveryType === 'pick-up') {
                if (!branch) {
                    console.log('On order continue: onAskBranch.')
                    onAskBranch(args, sendResponse)
                    return
                }
            }

            if (!phoneNumber) {
                console.log('On order continue: onAskContactNumber.')
                onAskContactNumber(args, sendResponse)
                return
            }

            console.log('On order continue: onAskConfirmation.')
            onAskConfirmation(args, sendResponse)
        })
    }
}

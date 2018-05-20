import onAskBranch from '../branch/onAskBranch'
import onAskLocation from '../location/onAskLocation'
import onAskDeliveryType from '../delivery-type/onAskDeliveryType'
import onAskContactNumber from '../customer/onAskContactNumber'
import onAskConfirmation from '../order/onAskConfirmation'
import api from '../../api'

const { getCustomer, hasCartItems } = api

export default (args, sendResponse) => {
    const { senderId } = args

    if (senderId) {
        const promises = [
            getCustomer(senderId),
            hasCartItems(senderId)
        ]
        Promise.all(promises).then(results => {
            const customer = results[0]
            const hasCart = results[1]

            if (!hasCart) {
                const payload = {
                    facebook: {
                        text: 'There are no items in your cart. Please add an item to continue.',
                        quick_replies: [
                            {
                                content_type: 'text',
                                title: 'Show menu',
                                payload: 'Show menu'
                            }
                        ]
                    }
                }
                const responseToCustomer = { payload }
                sendResponse({ responseToCustomer, ...args })
                return
            }

            const {
                branch,
                delivery_type: deliveryType,
                phone_number: phoneNumber,
                location
            } = customer

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

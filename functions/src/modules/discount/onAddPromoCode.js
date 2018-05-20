import onAskPromoCode from './onAskPromoCode'
import onOrderContinue from '../order/onOrderContinue'

import api from '../../api'

const { updateSessionDetails, getPromoByCode } = api

export default (args, sendResponse) => {
    const { parameters, senderId } = args
    const promoCode = parameters['promo-code']

    if (senderId) {
        if (!promoCode) {
            onAskPromoCode(args, sendResponse)
        } else {
            validatePromoCode(args, sendResponse, promoCode, senderId)
        }
    }
}

const validatePromoCode = (args, sendResponse, promoCode, senderId) => {
    const { timestamp } = args
    getPromoByCode(promoCode, timestamp).then(selectedPromo => {
        if (selectedPromo) {
            updateSessionDetails(senderId, { promo: selectedPromo })
            onOrderContinue(args, sendResponse)
        } else {
            const text = 'Invalid promo code. You can try again or proceed with your order.'
            const payload = {
                facebook: {
                    text,
                    quick_replies: [
                        {
                            content_type: 'text',
                            payload: 'Enter promo code',
                            title: 'Try again'
                        },
                        {
                            content_type: 'text',
                            payload: 'Proceed with order',
                            title: 'Proceed with order'
                        }
                    ]
                }
            }

            const responseToCustomer = {
                fulfillmentText: text,
                payload
            }

            sendResponse({
                responseToCustomer,
                ...args
            })
        }
    })
}

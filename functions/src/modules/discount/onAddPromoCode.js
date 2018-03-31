import moment from 'moment'

import { database } from '../../api/firebase'
import { toArray } from '../../utils'

import onAskPromoCode from './onAskPromoCode'
import onOrderContinue from '../order/onOrderContinue'

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
    getPromoCodePromise(promoCode, timestamp).then(selectedPromo => {
        if (selectedPromo) {
            const sessionRef = database.ref(`sessions/${senderId}`)
            sessionRef.update({ promo: selectedPromo })

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

            const responseToUser = {
                fulfillmentText: text,
                payload
            }

            sendResponse({
                responseToUser,
                ...args
            })
        }
    })
}

const getPromoCodePromise = (promoCode, timestamp) => {
    return new Promise((resolve, reject) => {
        database.ref('promos').once('value').then(snapshot => {
            const promos = toArray(snapshot.val())
            const selectedPromo = promos.find(promo => {
                if (promo.code === promoCode && promo.active) {
                    const requestDate = moment(timestamp)
                    const startDate = moment(promo.start_date, 'YYYY-MM-DD HH:mm')
                    const endDate = moment(promo.end_date, 'YYYY-MM-DD HH:mm')
                    return requestDate.isBetween(startDate, endDate)
                }
                return false
            })
            resolve(selectedPromo)
        })
    })
}

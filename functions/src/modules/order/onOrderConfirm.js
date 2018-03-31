import moment from 'moment'
import { getCartItems, database } from '../../api/firebase'

import onSendReceipt from './onSendReceipt'

export default (args, sendResponse) => {
    const { senderId } = args
    if (senderId) {
        const getCartItemsPromise = getCartItems(senderId, true)
        Promise.all([getCartItemsPromise, getUserPromise(senderId), getPromoPromise(senderId)]).then(results => {
            const orderKey = createOrder(args, results)
            args.orderKey = orderKey

            onSendReceipt(args, sendResponse)
            database.ref(`sessions/${senderId}`).remove()
        })
    } else {
        console.error('Invalid state: ' + JSON.stringify(args))
    }
}

const createOrder = (args, results) => {
    const { senderId, timestamp } = args
    const items = processCartItems(results[0])

    const user = results[1]
    const promo = results[2]

    const defaultStatus = 'PENDING'
    const formattedTimestamp = moment(timestamp).format('YYYY-MM-DD HH:mm')

    const millis = new Date().getTime()
    const order = {
        document_no: millis,
        timestamp,
        formatted_timestamp: formattedTimestamp,

        status: defaultStatus,
        sender_id: senderId,

        items,
        promo,
        user
    }

    const orderRef = database.ref(`orders/${senderId}`).push(order)
    const orderKey = orderRef.key

    const statusHistory = { status: defaultStatus, timestamp }
    orderRef.child('status_history').push(statusHistory)

    return orderKey
}

const processCartItems = (cartItems) => {
    const items = {}
    cartItems.forEach(item => {
        const { id, ...rest } = item
        items[id] = rest
    })
    return items
}

const getUserPromise = (senderId) => {
    return new Promise((resolve, reject) => {
        database.ref(`users/${senderId}`).once('value', snapshot => {
            resolve(snapshot.val())
        })
    })
}

const getPromoPromise = (senderId) => {
    return new Promise((resolve, reject) => {
        database.ref(`sessions/${senderId}/promo`).once('value', snapshot => {
            resolve(snapshot ? snapshot.val() : null)
        })
    })
}

import { getCartItems, database } from '../../api/firebase'

import onSendReceipt from './onSendReceipt'

export default (args, sendResponse) => {
    const { senderId } = args
    if (senderId) {
        const getCartItemsPromise = getCartItems(senderId, true)
        Promise.all([getCartItemsPromise, getUserPromise(senderId), getPromoPromise(senderId)]).then(results => {
            const items = {}
            results[0].forEach(item => {
                const { id, ...rest } = item
                items[id] = rest
            })

            const user = results[1]
            const promo = results[2]

            const millis = new Date().getTime()
            const order = {
                id: millis,
                timestamp: millis,
                senderId,
                items,
                promo,
                user
            }

            const orderRef = database.ref('orders').push(order)
            const orderId = orderRef.key

            onSendReceipt({ orderId, ...args }, sendResponse)
            database.ref(`sessions/${senderId}`).remove()
        })
    } else {
        console.error('Invalid state: ' + JSON.stringify(args))
    }
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

import { getCartItems, database } from '../../api/firebase'

import onSendReceipt from './onSendReceipt'

export default (args, sendResponse) => {
    const { senderId } = args
    if (senderId) {
        const getCartItemsPromise = getCartItems(senderId, true)
        const getUserPromise = new Promise((resolve, reject) => {
            database.ref(`users/${senderId}`).once('value', snapshot => {
                resolve(snapshot.val())
            })
        })

        Promise.all([getCartItemsPromise, getUserPromise]).then(results => {
            const items = {}
            results[0].forEach(item => {
                const { id, ...rest } = item
                items[id] = rest
            })

            const user = results[1]

            const millis = new Date().getTime()
            const order = {
                id: millis,
                timestamp: millis,
                senderId,
                items,
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

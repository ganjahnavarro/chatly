import onSendReceipt from './onSendReceipt'
import api from '../../api'

const { getCartItems, database } = api

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
    const user = results[1]
    const promo = results[2]

    const { items, totalAmount } = processCartItems(results[0], promo)

    const defaultStatus = 'PENDING'
    const millis = new Date().getTime()
    const order = {
        document_no: millis,
        total_amount: totalAmount,
        timestamp,

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

const processCartItems = (cartItems, promo) => {
    let totalAmount = 0
    const items = {}

    cartItems.forEach(item => {
        const { quantity, product, productType } = item

        const price = product ? product.price : productType.price
        const amount = quantity * price
        totalAmount += amount

        const { id, ...rest } = item
        items[id] = rest
    })

    if (promo) {
        totalAmount -= promo.discount_amount
    }

    return { items, totalAmount }
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

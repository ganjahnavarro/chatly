import onSendReceipt from './onSendReceipt'
import api from '../../api'

const { getCartItems, updateSessionDetails, addOrder,
    updateOrderStatusHistory, getUserDetails, getSessionDetails } = api

export default (args, sendResponse) => {
    const { senderId } = args
    if (senderId) {
        const promises = [
            getCartItems(senderId, true),
            getUserDetails(senderId),
            getSessionDetails(senderId)
        ]

        Promise.all(promises).then(results => {
            const orderKey = createOrder(args, results)
            args.orderKey = orderKey

            onSendReceipt(args, sendResponse)
            updateSessionDetails(senderId, null)
        })
    } else {
        console.error('Invalid state: ' + JSON.stringify(args))
    }
}

const createOrder = (args, results) => {
    const { senderId, timestamp } = args
    const user = results[1]
    const session = results[2]
    const promo = session.promo

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

    const orderKey = addOrder(senderId, order)

    const statusHistory = { status: defaultStatus, timestamp }
    updateOrderStatusHistory(senderId, orderKey, statusHistory)

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

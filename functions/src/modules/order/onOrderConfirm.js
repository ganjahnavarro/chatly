import onSendReceipt from './onSendReceipt'
import api from '../../api'

const { getCartItems, updateSessionDetails, addOrder,
    getUserDetails, getSessionDetails } = api

export default (args, sendResponse) => {
    const { senderId } = args
    if (senderId) {
        const promises = [
            getCartItems(senderId, true),
            getUserDetails(senderId),
            getSessionDetails(senderId)
        ]

        Promise.all(promises).then(results => {
            const order = createOrder(args, results)
            addOrder(order)
            args.order = order

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

    const items = results[0]
    const totalAmount = getTotalAmount(items, promo)

    const defaultStatus = 'PENDING'
    const millis = new Date().getTime()
    const order = {
        document_no: millis,
        total_amount: totalAmount,
        status: defaultStatus,
        timestamp,

        senderId,
        items,
        promo,
        user,

        status_history: [
            { status: defaultStatus, timestamp }
        ]
    }
    return order
}

const getTotalAmount = (cartItems, promo) => {
    let totalAmount = 0

    cartItems.forEach(item => {
        const { quantity, product, product_type: productType } = item
        const price = product ? product.price : productType.price
        const amount = quantity * price
        totalAmount += amount
    })

    if (promo) {
        totalAmount -= promo.discount_amount
    }
    return totalAmount
}

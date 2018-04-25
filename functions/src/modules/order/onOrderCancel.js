import moment from 'moment'
import api from '../../api'

const { getUserOrders, updateOrderDetails, updateOrderStatusHistory } = api

export default (args, sendResponse) => {
    const { senderId, parameters } = args
    const documentNo = parameters['document-no']

    if (senderId) {
        getUserOrders(args).then(userOrders => {
            if (documentNo) {
                const userOrder = userOrders.find(userOrder => String(userOrder.document_no) === documentNo)
                handleSingleOrder(args, sendResponse, userOrder)
            } else {
                const endStatuses = ['PROCESSED', 'CANCELLED']
                const filteredUserOrders = userOrders.filter(userOrder => !endStatuses.includes(userOrder.status))

                if (filteredUserOrders && filteredUserOrders.length) {
                    handleOrderCancelling(args, sendResponse, filteredUserOrders)
                } else {
                    const responseToUser = 'You currently have no orders in progress.'
                    sendResponse({ responseToUser, ...args })
                }
            }
        })
    }
}

const handleOrderCancelling = (args, sendResponse, filteredUserOrders) => {
    const isMultiple = filteredUserOrders.length > 1

    if (isMultiple) {
        handleMultipleOrders(args, sendResponse, filteredUserOrders)
    } else {
        handleSingleOrder(args, sendResponse, filteredUserOrders[0])
    }
}

const handleMultipleOrders = (args, sendResponse, filteredUserOrders) => {
    const responseToUser = {}

    const elements = filteredUserOrders.map(userOrder => {
        const formattedTimestamp = moment(userOrder.timestamp).format('YYYY-MM-DD HH:mm')
        return {
            title: `Order #: ${userOrder.document_no}`,
            subtitle: `Date: ${formattedTimestamp}`,
            buttons: [
                {
                    type: 'postback',
                    payload: `Cancel order no.: ${userOrder.document_no}`,
                    title: 'Cancel this order'
                }
            ]
        }
    })
    const payload = {
        facebook: {
            attachment: {
                type: 'template',
                payload: {
                    template_type: 'generic',
                    elements: elements
                }
            }
        }
    }

    responseToUser.payload = payload
    responseToUser.fulfillmentText = 'You have multiple orders in progress. Which one of your orders you want to cancel?'

    sendResponse({
        responseToUser,
        ...args
    })
}

const handleSingleOrder = (args, sendResponse, userOrder) => {
    const { timestamp } = args

    const endStatuses = ['PROCESSED', 'CANCELLED']
    if (userOrder.status === 'PENDING') {
        const cancelledStatus = 'CANCELLED'
        const formattedTimestamp = moment(timestamp).format('YYYY-MM-DD HH:mm')

        updateOrderDetails(userOrder._id, { status: cancelledStatus })
        updateOrderStatusHistory(userOrder._id, {
            status: cancelledStatus,
            date: formattedTimestamp
        })

        const responseToUser = `Order # ${userOrder.document_no} is successfully cancelled.`
        sendResponse({ responseToUser, ...args })
    } else if (endStatuses.includes(userOrder.status)) {
        const responseToUser = `Order is already ${userOrder.status.toLowerCase()}. Don't hesitate to call us for more information.`
        sendResponse({ responseToUser, ...args })
    } else {
        const responseToUser = 'Sorry order is already on the way! You can\'t cancel at this time. Don\'t hesitate to call us for more information.'
        sendResponse({ responseToUser, ...args })
    }
}

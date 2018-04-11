import moment from 'moment'
import { toArray } from '../../utils'
import api from '../../api'

const { database } = api

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
    const { timestamp, senderId } = args

    const endStatuses = ['PROCESSED', 'CANCELLED']
    if (userOrder.status === 'PENDING') {
        const cancelledStatus = 'CANCELLED'
        const formattedTimestamp = moment(timestamp).format('YYYY-MM-DD HH:mm')

        const userOrderRef = database.ref(`orders/${senderId}/${userOrder.id}`)
        userOrderRef.update({ status: cancelledStatus })

        userOrderRef.child('status_history').push({
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

const getUserOrders = (args) => {
    const { senderId } = args
    return new Promise((resolve, reject) => {
        database.ref(`orders/${senderId}`).once('value', snapshot => {
            if (snapshot && snapshot.val()) {
                resolve(toArray(snapshot.val()))
            } else {
                resolve([])
            }
        })
    })
}

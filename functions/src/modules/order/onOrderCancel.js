import moment from 'moment'
import api from '../../api'

const { getCustomerOrders, updateOrderDetails, updateOrderStatusHistory } = api

export default (args, sendResponse) => {
    const { senderId, parameters } = args
    const documentNo = parameters['document-no']

    if (senderId) {
        getCustomerOrders(args).then(customerOrders => {
            if (documentNo) {
                const customerOrder = customerOrders.find(customerOrder => String(customerOrder.document_no) === documentNo)
                handleSingleOrder(args, sendResponse, customerOrder)
            } else {
                const endStatuses = ['PROCESSED', 'CANCELLED']
                const filteredCustomerOrders = customerOrders.filter(customerOrder => !endStatuses.includes(customerOrder.status))

                if (filteredCustomerOrders && filteredCustomerOrders.length) {
                    handleOrderCancelling(args, sendResponse, filteredCustomerOrders)
                } else {
                    const responseToCustomer = 'You currently have no orders in progress.'
                    sendResponse({ responseToCustomer, ...args })
                }
            }
        })
    }
}

const handleOrderCancelling = (args, sendResponse, filteredCustomerOrders) => {
    const isMultiple = filteredCustomerOrders.length > 1

    if (isMultiple) {
        handleMultipleOrders(args, sendResponse, filteredCustomerOrders)
    } else {
        handleSingleOrder(args, sendResponse, filteredCustomerOrders[0])
    }
}

const handleMultipleOrders = (args, sendResponse, filteredCustomerOrders) => {
    const responseToCustomer = {}

    const elements = filteredCustomerOrders.map(customerOrder => {
        const formattedTimestamp = moment(customerOrder.timestamp).format('YYYY-MM-DD HH:mm')
        return {
            title: `Order #: ${customerOrder.document_no}`,
            subtitle: `Date: ${formattedTimestamp}`,
            buttons: [
                {
                    type: 'postback',
                    payload: `Cancel order no.: ${customerOrder.document_no}`,
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

    responseToCustomer.payload = payload
    responseToCustomer.fulfillmentText = 'You have multiple orders in progress. Which one of your orders you want to cancel?'

    sendResponse({
        responseToCustomer,
        ...args
    })
}

const handleSingleOrder = (args, sendResponse, customerOrder) => {
    const { timestamp } = args

    const endStatuses = ['PROCESSED', 'CANCELLED']
    if (customerOrder.status === 'PENDING') {
        const cancelledStatus = 'CANCELLED'
        const formattedTimestamp = moment(timestamp).format('YYYY-MM-DD HH:mm')

        updateOrderDetails(customerOrder._id, { status: cancelledStatus })
        updateOrderStatusHistory(customerOrder._id, {
            status: cancelledStatus,
            date: formattedTimestamp
        })

        const responseToCustomer = `Order # ${customerOrder.document_no} is successfully cancelled.`
        sendResponse({ responseToCustomer, ...args })
    } else if (endStatuses.includes(customerOrder.status)) {
        const responseToCustomer = `Order is already ${customerOrder.status.toLowerCase()}. Don't hesitate to call us for more information.`
        sendResponse({ responseToCustomer, ...args })
    } else {
        const responseToCustomer = 'Sorry order is already on the way! You can\'t cancel at this time. Don\'t hesitate to call us for more information.'
        sendResponse({ responseToCustomer, ...args })
    }
}

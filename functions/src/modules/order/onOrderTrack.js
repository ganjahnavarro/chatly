import moment from 'moment'
import api from '../../api'

const { getCustomerOrders } = api

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
                const filteredUserOrders = customerOrders.filter(customerOrder => !endStatuses.includes(customerOrder.status))

                if (filteredUserOrders && filteredUserOrders.length) {
                    handleOrderCancelling(args, sendResponse, filteredUserOrders)
                } else {
                    const responseToCustomer = 'You currently have no orders in progress.'
                    sendResponse({ responseToCustomer, ...args })
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
    const responseToCustomer = {}

    const elements = filteredUserOrders.map(customerOrder => {
        const {
            timestamp,
            document_no: documentNo,
            total_amount: totalAmount
        } = customerOrder

        const formattedTimestamp = moment(timestamp).format('YYYY-MM-DD HH:mm')
        return {
            title: `Order #: ${documentNo}`,
            subtitle: `Total Amount: P${totalAmount.toFixed(2)} \nDate: ${formattedTimestamp}`,
            buttons: [
                {
                    type: 'postback',
                    payload: `View receipt order no.: ${documentNo}`,
                    title: 'View Receipt'
                },
                {
                    type: 'postback',
                    payload: `Track order no.: ${documentNo}`,
                    title: 'View status'
                },
                {
                    type: 'postback',
                    payload: `Cancel order no.: ${documentNo}`,
                    title: 'Cancel order'
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
    responseToCustomer.fulfillmentText = 'You have multiple orders in progress. Which one of your orders you want to check?'

    sendResponse({
        responseToCustomer,
        ...args
    })
}

const handleSingleOrder = (args, sendResponse, customerOrder) => {
    let message = `Order # ${customerOrder.document_no} status history: \n`

    const statusHistories = customerOrder.status_history || []
    statusHistories.forEach(statusHistory => {
        const formattedTimestamp = moment(statusHistory.timestamp).format('YYYY-MM-DD HH:mm')
        message += '\n' + `Status changed to: ${statusHistory.status} at ${formattedTimestamp}`
    })
    sendResponse({ responseToCustomer: message, ...args })
}

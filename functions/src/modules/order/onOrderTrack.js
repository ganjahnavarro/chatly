import moment from 'moment'
import api from '../../api'

const { getUserOrders } = api

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
        const {
            timestamp,
            document_no: documentNo,
            total_amount: totalAmount
        } = userOrder

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

    responseToUser.payload = payload
    responseToUser.fulfillmentText = 'You have multiple orders in progress. Which one of your orders you want to check?'

    sendResponse({
        responseToUser,
        ...args
    })
}

const handleSingleOrder = (args, sendResponse, userOrder) => {
    let message = `Order # ${userOrder.document_no} status history: \n`

    const statusHistories = userOrder.status_history || []
    statusHistories.forEach(statusHistory => {
        const formattedTimestamp = moment(statusHistory.timestamp).format('YYYY-MM-DD HH:mm')
        message += '\n' + `Status changed to: ${statusHistory.status} at ${formattedTimestamp}`
    })
    sendResponse({ responseToUser: message, ...args })
}

export default (args, sendResponse) => {
    const { parameters } = args
    const deliveryType = parameters['delivery-type']

    let responseToCustomer = {}
    const deliveryMessage = 'In what address you want this order to be delivered?'
    const defaultMessage = 'What is your address?'

    const fulfillmentText = deliveryType === 'delivery' ? deliveryMessage : defaultMessage
    const payload = {
        facebook: {
            text: fulfillmentText,
            quick_replies: [
                {
                    content_type: 'location'
                }
            ]
        }
    }
    responseToCustomer = { fulfillmentText, payload }
    sendResponse({ responseToCustomer, ...args })
}

export default (args, sendResponse) => {
    const { parameters } = args
    const deliveryType = parameters['delivery-type']

    const deliveryMessage = 'In what address you want this order to be delivered?'
    const pickupMessage = 'What is your address?'

    const fulfillmentText = deliveryType === 'delivery' ? deliveryMessage : pickupMessage
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
    let responseToUser = { fulfillmentText, payload }
    sendResponse({ responseToUser, ...args })
}

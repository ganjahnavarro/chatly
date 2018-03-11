export default (args, sendResponse) => {
    const fulfillmentText = 'In what address you want this order to be delivered?'
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

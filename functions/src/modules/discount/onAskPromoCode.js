export default (args, sendResponse) => {
    const { session } = args
    const outputContexts = [
        {
            name: `${session}/contexts/awaiting-promo-code`,
            lifespanCount: 1
        }
    ]

    const responseToUser = {
        fulfillmentText: 'Please enter your promo code.',
        outputContexts
    }

    sendResponse({ responseToUser, ...args })
}

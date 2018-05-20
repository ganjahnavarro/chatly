export default (args, sendResponse) => {
    const { session } = args
    const outputContexts = [
        {
            name: `${session}/contexts/awaiting-promo-code`,
            lifespanCount: 1
        }
    ]

    const responseToCustomer = {
        fulfillmentText: 'Please enter your promo code.',
        outputContexts
    }

    sendResponse({ responseToCustomer, ...args })
}

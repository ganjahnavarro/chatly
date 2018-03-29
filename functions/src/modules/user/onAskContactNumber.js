export default (args, sendResponse) => {
    const { session } = args
    const outputContexts = [
        {
            name: `${session}/contexts/awaiting-phone-number`,
            lifespanCount: 1
        }
    ]

    const responseToUser = {
        fulfillmentText: 'OK. Can you tell me your contact number?',
        outputContexts
    }

    sendResponse({ responseToUser, ...args })
}

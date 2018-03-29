export default (args, sendResponse) => {
    const { session } = args

    const text = 'Delivery or pick-up?'
    const payload = {
        facebook: {
            text,
            quick_replies: [
                {
                    content_type: 'text',
                    payload: 'Change my delivery type to delivery',
                    title: 'Delivery'
                },
                {
                    content_type: 'text',
                    payload: 'Change my delivery type to pick-up',
                    title: 'Pick-up'
                }
            ]
        }
    }

    const outputContexts = [
        {
            name: `${session}/contexts/awaiting-delivery-type`,
            lifespanCount: 1
        }
    ]

    const responseToUser = {
        fulfillmentText: text,
        outputContexts,
        payload
    }

    sendResponse({
        responseToUser,
        ...args
    })
}

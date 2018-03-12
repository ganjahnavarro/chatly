export default (args, sendResponse) => {
    const text = 'Delivery or pick-up?'
    const payload = {
        facebook: {
            text,
            quick_replies: [
                {
                    content_type: 'text',
                    title: 'Delivery',
                    payload: 'p.delivery'
                },
                {
                    content_type: 'text',
                    title: 'Pick-up',
                    payload: 'p.pickup'
                }
            ]
        }
    }
    const responseToUser = { fulfillmentText: text, payload }

    sendResponse({
        responseToUser,
        ...args
    })
}

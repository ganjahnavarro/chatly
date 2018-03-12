export default (args, sendResponse) => {
    const fulfillmentText = 'Sample Quick Reply'
    const payload = {
        facebook: {
            text: 'Pick a pizza:',
            quick_replies: [
                {
                    content_type: 'text',
                    title: 'EXTRAVAGANZZA',
                    payload: 'EXTRAVAGANZZA'
                },
                {
                    content_type: 'text',
                    title: 'KALAMATA TOMATO',
                    payload: 'KALAMATA TOMATO'
                },
                {
                    content_type: 'text',
                    title: 'CHICKEN BBQ SAUSAGE',
                    payload: 'sample quick reply'
                }
            ]
        }
    }
    const responseToUser = { fulfillmentText, payload }

    sendResponse({
        responseToUser,
        ...args
    })
}

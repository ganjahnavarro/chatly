export default (args, sendResponse) => {
    console.log(args, 'test argel')
    /* const responseToUser = {
        messages: {
            platform: 'facebook',
            replies: ['Quick reply 1', 'Quick reply 2', 'Quick reply 3'],
            title: 'Quick Reply Title',
            type: 1
        }
    } */

    /* const payload = {
        facebook: {
            text: 'Pick a color:',
            quick_replies: [
                {
                    content_type: 'text',
                    title: 'Red',
                    payload: 'red'
                },
                {
                    content_type: 'text',
                    title: 'Green',
                    payload: 'green'
                }
            ]
        }
    } */
    // const responseToUser = { fulfillmentText, payload }

    sendResponse({
        responseToUser: 'Test argel',
        ...args
    })
}

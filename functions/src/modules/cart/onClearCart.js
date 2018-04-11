import api from '../../api'

const { database } = api

export default (args, sendResponse) => {
    const { senderId } = args

    if (senderId) {
        database.ref(`sessions/${senderId}/cart`).remove().then(() => {
            const payload = {
                facebook: {
                    text: 'Cart cleared. Please add an order to continue.',
                    quick_replies: [
                        {
                            content_type: 'text',
                            title: 'Show menu',
                            payload: 'Show menu'
                        }
                    ]
                }
            }
            const responseToUser = { payload }
            sendResponse({ responseToUser, ...args })
        })
    }
}

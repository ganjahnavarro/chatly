import { database } from '../../api/firebase'

export default (args, sendResponse) => {
    const { senderId } = args

    if (senderId) {
        database.ref(`sessions/${senderId}/cart`).remove().then(() => {
            const message = `Cart cleared. Please add an order to continue.`
            sendResponse({ responseToUser: message, ...args })
        })
    }
}

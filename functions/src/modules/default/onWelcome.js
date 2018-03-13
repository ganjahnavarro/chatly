import { getUserDetails } from '../../api/messenger'
import { database } from '../../api/firebase'

export default (args, sendResponse) => {
    const { senderId } = args

    if (senderId) {
        getUserDetails(senderId)
        database.ref(`sessions/${senderId}`).remove()
    }
    sendResponse({ responseToUser: 'Welcome!', ...args })
}

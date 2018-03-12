import { database } from '../../api/firebase'

export default (args, sendResponse) => {
    const { payloadData } = args

    if (payloadData.sender && payloadData.sender.id) {
        const senderId = payloadData.sender.id

        console.log('Sender ID: ', senderId)

        database.ref(`sessions/${senderId}`).set({ deliveryType: 'delivery' })
    }

    const responseToUser = 'Delivery or pick-up?'
    sendResponse({ responseToUser, ...args })
}

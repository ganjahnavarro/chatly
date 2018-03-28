import { database } from '../../api/firebase'
import onOrderContinue from '../order/onOrderContinue'

export default (args, sendResponse) => {
    const { payloadData, senderId } = args
    if (payloadData && payloadData.postback && payloadData.postback.data && senderId) {
        const { lat, long } = payloadData.postback.data
        const usersRef = database.ref(`users/${senderId}`)

        const location = { lat, long }
        usersRef.update({ location })

        console.log(`Location received. Sender: ${senderId}, Lat: ${lat}, Long: ${long}.`)

        onOrderContinue(args, sendResponse)
    } else {
        console.error('Invalid state. Payload Data: ' + JSON.stringify(payloadData))
    }
}

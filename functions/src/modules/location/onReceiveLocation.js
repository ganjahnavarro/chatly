import { database } from '../../api/firebase'
import onAskContactNumber from '../user/onAskContactNumber'
import onAskBranch from '../branch/onAskBranch'

export default (args, sendResponse) => {
    const { payloadData, senderId } = args
    if (payloadData && payloadData.postback && payloadData.postback.data && senderId) {
        const { lat, long } = payloadData.postback.data
        const sessionRef = database.ref(`sessions/${senderId}`)

        const location = { lat, long }
        sessionRef.update({ location })

        console.log(`Location received. Sender: ${senderId}, Lat: ${lat}, Long: ${long}.`)

        sessionRef.once('value').then(snapshot => {
            const session = snapshot.val()
            switch (session.delivery_type) {
                case 'delivery':
                    onAskContactNumber(args, sendResponse)
                    break
                case 'pick-up':
                    onAskBranch(args, sendResponse)
                    break
            }
        })
    } else {
        console.error('Invalid state. Payload Data: ' + JSON.stringify(payloadData))
    }
}

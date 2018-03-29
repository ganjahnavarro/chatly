import { database } from '../../api/firebase'
import { getAddress } from '../../api/maps'

import onOrderContinue from '../order/onOrderContinue'

export default (args, sendResponse) => {
    const { payloadData, senderId } = args
    if (payloadData && payloadData.postback && payloadData.postback.data && senderId) {
        const usersRef = database.ref(`users/${senderId}`)

        const { lat, long } = payloadData.postback.data
        console.log(`Location received. Sender: ${senderId}, Lat: ${lat}, Long: ${long}.`)

        getAddress(lat, long).then(response => {
            console.log('Get address response: ', response.status)

            let location = { lat, long }
            location.mapsData = response
            // location.mapsData = response.results[0]

            usersRef.update({ location })
            onOrderContinue(args, sendResponse)
        })
    } else {
        console.error('Invalid state. Payload Data: ' + JSON.stringify(payloadData))
    }
}

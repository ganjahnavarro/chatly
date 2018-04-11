import onOrderContinue from '../order/onOrderContinue'
import { getAddress } from '../../api/maps'

import api from '../../api'

const { database } = api

export default (args, sendResponse) => {
    const { payloadData, senderId } = args
    if (payloadData && payloadData.postback && payloadData.postback.data && senderId) {
        const usersRef = database.ref(`users/${senderId}`)

        const { lat, long } = payloadData.postback.data
        console.log(`Location received. Sender: ${senderId}, Lat: ${lat}, Long: ${long}.`)

        getAddress(lat, long).then(response => {
            let location = { lat, long }
            location.mapsData = response

            usersRef.update({ location })
            onOrderContinue(args, sendResponse)
        })
    } else {
        console.error('Invalid state. Payload Data: ' + JSON.stringify(payloadData))
    }
}

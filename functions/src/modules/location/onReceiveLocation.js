export default (args, sendResponse) => {
    const { payloadData } = args
    if (payloadData && payloadData.postback && payloadData.postback.data) {
        const { lat, long } = payloadData.postback.data
        sendResponse({ responseToUser: `Location received. Lat: ${lat}, Long: ${long}.`, ...args })
    } else {
        console.error('Invalid state. Payload Data: ' + JSON.stringify(payloadData))
    }
}

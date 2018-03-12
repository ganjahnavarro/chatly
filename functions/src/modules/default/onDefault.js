export default (args, sendResponse) => {
    let responseToUser = { fulfillmentText: 'Sorry I don\'t understand.' }
    sendResponse({ responseToUser, ...args })
}

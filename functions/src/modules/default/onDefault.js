export default (args, sendResponse) => {
    let responseToUser = { fulfillmentText: 'Please wait for a while and I will get back to you shortly.' }
    sendResponse({ responseToUser, ...args })
}

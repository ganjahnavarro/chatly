export default (args, sendResponse) => {
    const message = 'OK. Can you tell me your contact number?'
    sendResponse({ responseToUser: message, ...args })
}

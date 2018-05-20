export default (args, sendResponse) => {
    let responseToCustomer = { fulfillmentText: 'Please wait for a while and I will get back to you shortly.' }
    sendResponse({ responseToCustomer, ...args })
}

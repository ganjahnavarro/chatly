export default (args, sendResponse) => {
    sendResponse({ responseToUser: JSON.stringify([]), ...args })
}

export default (args, sendResponse) => {
    sendResponse({ responseToUser: 'Item removed. (TODO)', ...args })
}

export default (args, sendResponse) => {
    // tempCart = []
    sendResponse({ responseToUser: 'Cart cleared.', ...args })
}

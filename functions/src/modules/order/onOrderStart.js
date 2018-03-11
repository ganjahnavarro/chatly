export default (args, sendResponse) => {
    const { parameters } = args
    const { quantity, product } = parameters

    // tempCart.push({ quantity, product })

    const message = `OK, ${quantity} ${product} added to your cart. Anything else?`
    sendResponse({ responseToUser: message, ...args })
}

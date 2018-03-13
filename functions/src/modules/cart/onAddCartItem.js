import { getProducts, database } from '../../api/firebase'

export default (args, sendResponse) => {
    const { parameters, senderId } = args

    const { product } = parameters
    const quantity = parameters.quantity || 1

    if (senderId) {
        getProducts().then(products => {
            const selectedProduct = products.find(item => item.name.toLowerCase() === product.toLowerCase())
            console.log(JSON.stringify(selectedProduct))

            if (selectedProduct) {
                const { id, name } = selectedProduct

                const cartRef = database.ref(`sessions/${senderId}/cart`)
                cartRef.push({ product: id, quantity })

                const message = `OK. ${quantity} ${name} added to your cart. Anything else?`
                sendResponse({ responseToUser: message, ...args })
            }
        })
    }
}

import { getProducts, database } from '../../api/firebase'

export default (args, sendResponse) => {
    const { parameters, payloadData } = args

    const { product } = parameters
    const quantity = parameters.quantity || 1

    if (payloadData && payloadData.sender && payloadData.sender.id) {
        const senderId = payloadData.sender.id

        getProducts().then(products => {
            const selectedProduct = products.find(item => item.name.toLowerCase() === product.toLowerCase())
            console.log(JSON.stringify(selectedProduct))

            if (selectedProduct) {
                const { id, name } = selectedProduct

                const cartRef = database.ref(`sessions/${senderId}/cart`)
                cartRef.push({ product: id, quantity })

                const message = `OK. ${quantity} ${name} (${id}) added to your cart. Anything else?`
                sendResponse({ responseToUser: message, ...args })
            }
        })
    }
}

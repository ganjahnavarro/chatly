import { getCartItems } from '../../api/firebase'

export default (args, sendResponse) => {
    const { senderId } = args
    if (senderId) {
        getCartItems(senderId).then(items => {
            let totalAmount = 0

            const elements = items.map(item => {
                const { quantity, product, productType } = item

                const price = product ? product.price : productType.price
                const amount = quantity * price
                totalAmount += amount

                const productTypeDescription = productType.description || ''
                const productDescription = product ? ` (${product.description})` : ''

                return {
                    title: `${productType.name}${productDescription}`,
                    subtitle: productTypeDescription,
                    quantity: quantity,
                    price: amount,
                    currency: 'PHP',
                    image_url: productType.image_url
                }
            })

            // TODO Replace order_number, recipient_name, address

            const millis = new Date().getTime()
            const payload = {
                facebook: {
                    attachment: {
                        type: 'template',
                        payload: {
                            template_type: 'receipt',
                            recipient_name: 'Gan Jah Navarro',
                            merchant_name: 'Domino\'s Pizza',
                            order_number: millis,
                            currency: 'PHP',
                            payment_method: 'To be paid',
                            timestamp: parseInt(millis / 1000),
                            address: {
                                street_1: '43 Manapat St., Tañong',
                                city: 'Malabon',
                                postal_code: '1470',
                                state: 'Metro Manila',
                                country: 'PH'
                            },
                            summary: {
                                total_cost: totalAmount
                            },
                            elements
                        }
                    }
                }
            }

            const responseToUser = { payload }
            sendResponse({ responseToUser, ...args })
        })
    } else {
        console.error('Invalid state: ' + JSON.stringify(args))
    }
}

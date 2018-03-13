import { getCartItems } from '../../api/firebase'

export default (args, sendResponse) => {
    const { senderId } = args
    if (senderId) {
        getCartItems(senderId).then(items => {
            let totalAmount = 0
            const elements = []

            items.forEach(item => {
                const amount = item.quantity * item.product.price
                totalAmount += amount

                elements.push({
                    title: item.product.name,
                    subtitle: item.product.description,
                    quantity: item.quantity,
                    price: amount,
                    currency: 'PHP',
                    image_url: item.product.image_url
                })
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
                            payment_method: 'Cash',
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

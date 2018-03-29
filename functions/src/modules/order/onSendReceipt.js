import { database } from '../../api/firebase'
import { toArray } from '../../utils'

export default (args, sendResponse) => {
    const { orderId } = args
    if (orderId) {
        const getCompanyPromise = new Promise((resolve, reject) => {
            database.ref('company').once('value', snapshot => {
                resolve(snapshot.val())
            })
        })

        const getOrderPromise = new Promise((resolve, reject) => {
            database.ref(`orders/${orderId}`).once('value', snapshot => {
                resolve(snapshot.val())
            })
        })

        Promise.all([getOrderPromise, getCompanyPromise]).then(results => {
            const order = results[0]
            const company = results[1]

            const { id, items, user, timestamp } = order

            let totalAmount = 0

            const elements = toArray(items).map(item => {
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

            // TODO Replace address

            const payload = {
                facebook: {
                    attachment: {
                        type: 'template',
                        payload: {
                            template_type: 'receipt',
                            recipient_name: `${user.first_name} ${user.last_name}`,
                            merchant_name: company.name,
                            order_number: id,
                            currency: 'PHP',
                            payment_method: 'To be paid',
                            timestamp: parseInt(timestamp / 1000),
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

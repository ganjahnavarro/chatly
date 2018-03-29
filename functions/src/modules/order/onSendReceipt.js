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
                            address: getAddress(user),
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

const getAddress = (user) => {
    const { mapsData } = user.location

    const streetNumber = mapsData.street_number ? `${mapsData.street_number} ` : ''
    const route = mapsData.route ? `${mapsData.route} St.` : ''
    const sublocality = mapsData.sublocality ? `, ${mapsData.sublocality}` : ''

    return {
        street_1: `${streetNumber}${route}${sublocality}`,
        city: mapsData.locality,
        postal_code: mapsData.postal_code,
        state: mapsData.administrative_area,
        country: mapsData.country
    }
}

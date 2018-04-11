import { toArray } from '../../utils'
import api from '../../api'

const { database } = api

export default (args, sendResponse) => {
    const getCompanyPromise = new Promise((resolve, reject) => {
        database.ref('company').once('value', snapshot => {
            resolve(snapshot.val())
        })
    })

    Promise.all([getOrderPromise(args), getCompanyPromise]).then(results => {
        const order = results[0]
        const company = results[1]

        const { document_no: documentNo, items, user, timestamp, promo } = order

        let totalAmount = 0
        let discountAmount = 0

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

        const attachment = {
            type: 'template',
            payload: {
                template_type: 'receipt',
                recipient_name: `${user.first_name} ${user.last_name}`,
                merchant_name: company.name,
                order_number: documentNo,
                currency: 'PHP',
                payment_method: 'To be paid',
                timestamp: parseInt(timestamp / 1000),
                address: getAddress(user),
                elements
            }
        }

        if (promo) {
            attachment.payload.adjustments = [{
                name: `Promo Code (${promo.code})`,
                amount: promo.discount_amount
            }]
            discountAmount = promo.discount_amount
        }

        attachment.payload.summary = {
            subtotal: totalAmount,
            total_cost: totalAmount - discountAmount
        }

        const payload = {
            facebook: { attachment }
        }

        const responseToUser = { payload }
        sendResponse({ responseToUser, ...args })
    })
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

const getOrderPromise = (args) => {
    const { orderKey, senderId, parameters } = args
    const documentNo = parameters['document-no']

    return new Promise((resolve, reject) => {
        const orderRef = database.ref(`orders/${senderId}`)

        if (orderKey) {
            orderRef.child(orderKey).once('value', snapshot => resolve(snapshot.val()))
        } else if (documentNo) {
            orderRef.once('value', snapshot => {
                if (snapshot && snapshot.val()) {
                    const orders = toArray(snapshot.val())
                    const order = orders.find(order => String(order.document_no) === documentNo)
                    resolve(order)
                }
            })
        }
    })
}

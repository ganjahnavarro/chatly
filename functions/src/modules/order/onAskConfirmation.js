import api from '../../api'

const { getCartItems, getUserDetails, getSessionDetails } = api

export default (args, sendResponse) => {
    const { senderId } = args
    if (senderId) {
        getCartItems(senderId).then(items => {
            const promises = [
                getSessionDetails(senderId),
                getUserDetails(senderId)
            ]
            Promise.all(promises).then(results => {
                const session = results[0]
                const user = results[1]
                const isDelivery = user.delivery_type === 'delivery'

                const promo = session.promo

                let totalAmount = 0
                let message =
                  `Here's your order details: \n\n` +
                  'Cart: \n'

                items.forEach(item => {
                    const { quantity, product, product_type: productType } = item

                    const price = product ? product.price : productType.price
                    const amount = quantity * price
                    totalAmount += amount

                    const productDescription = product ? ` (${product.description})` : ''
                    message += `${quantity} ${productType.name}${productDescription} (P${amount.toFixed(2)}) \n`
                })

                if (promo) {
                    totalAmount -= promo.discount_amount
                }

                const deliveryTypeMessage = `Delivery Type: ${isDelivery ? 'Delivery' : 'Pick-up'} \n`
                const branchMessage = `Branch: ${user.branch && user.branch.name} \n`
                const addressMessage = `Address: ${user.location && user.location.mapsData ? user.location.mapsData.formatted_address : '(Coordinates only)'} \n`
                const phoneNumberMessage = `Contact No.: ${user.phone_number} \n`

                const promoCodeMessage = promo ? `Promo code: ${promo.code} \n` +
                  `Discount: ${promo.discount_amount} \n` : ''

                const totalAmountMessage = `Total Amount: P${totalAmount.toFixed(2)}`

                message +=
                  '\n' +
                  deliveryTypeMessage +
                  (isDelivery ? addressMessage : branchMessage) +
                  phoneNumberMessage +
                  '\n' +
                  promoCodeMessage +
                  totalAmountMessage

                const payload = {
                    facebook: {
                        text: message,
                        quick_replies: getActions(isDelivery)
                    }
                }

                const responseToUser = { payload }
                sendResponse({ responseToUser, ...args })
            })
        })
    } else {
        console.error('Invalid state: ' + JSON.stringify(args))
    }
}

const getActions = (isDelivery) => {
    let actions = [
        {
            content_type: 'text',
            title: 'Confirm Order',
            payload: 'Confirm Order'
        },
        {
            content_type: 'text',
            title: 'Enter Promo Code',
            payload: 'Enter Promo Code'
        },
        {
            content_type: 'text',
            title: 'Add/Remove Items',
            payload: 'Show my cart (Add/Remove Items)'
        },
        {
            content_type: 'text',
            title: 'Change Delivery Type',
            payload: 'Change Delivery Type'
        }
    ]

    if (!isDelivery) {
        actions.push({
            content_type: 'text',
            title: 'Change Branch',
            payload: 'Change Branch'
        })
    }

    actions = actions.concat([
        {
            content_type: 'text',
            title: 'Change Address',
            payload: 'Change Address'
        },
        {
            content_type: 'text',
            title: 'Change Phone Number',
            payload: 'Change Phone Number'
        }
    ])

    return actions
}

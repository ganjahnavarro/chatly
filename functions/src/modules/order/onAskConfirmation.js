import { getCartItems, database } from '../../api/firebase'

export default (args, sendResponse) => {
    const { senderId } = args
    if (senderId) {
        getCartItems(senderId).then(items => {
            const sessionRef = database.ref(`sessions/${senderId}`)
            sessionRef.once('value').then(snapshot => {
                const session = snapshot.val()
                const isDelivery = session.delivery_type === 'delivery'

                console.log('Session: ', JSON.stringify(session))
                console.log('Items: ', JSON.stringify(items))

                let totalAmount = 0
                let message =
                  'We need you to confirm your order. Order Details: \n\n' +
                  'Cart: \n'

                items.forEach(item => {
                    const { quantity, product, productType } = item

                    const price = product ? product.price : productType.price
                    const amount = quantity * price
                    totalAmount += amount

                    const productDescription = product ? ` (${product.description})` : ''
                    message += `${quantity} ${productType.name}${productDescription} (P${amount.toFixed(2)}) \n`
                })

                const deliveryTypeMessage = `Delivery Type: ${isDelivery ? 'Delivery' : 'Pick-up'} \n`
                const branchMessage = `Branch: ${session.branch && session.branch.name} \n`
                const addressMessage = `Address: (lat, long) ${session.location.lat}, ${session.location.long} \n`
                const phoneNumberMessage = `Contact No.: ${session.phone_number} \n`
                const totalAmountMessage = `Total Amount: P${totalAmount.toFixed(2)}`

                message +=
                  '\n' +
                  deliveryTypeMessage +
                  (isDelivery ? addressMessage : branchMessage) +
                  phoneNumberMessage +
                  '\n' +
                  totalAmountMessage

                console.log('Message: ', message)

                const actions = [
                    {
                        content_type: 'text',
                        title: 'Confirm Order',
                        payload: 'Confirm Order'
                    },
                    {
                        content_type: 'text',
                        title: 'Add/Remove Items',
                        payload: 'Add/Remove Items'
                    },
                    {
                        content_type: 'text',
                        title: 'Change Delivery Type',
                        payload: 'Change Delivery Type'
                    },
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
                ]

                const payload = {
                    facebook: {
                        text: message,
                        quick_replies: actions
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

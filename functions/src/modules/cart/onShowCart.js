import { getCartItems } from '../../api/firebase'

const onShowCart = (args, sendResponse) => {
    const { senderId } = args
    if (senderId) {
        getCartItems(senderId).then(items => {
            const elements = []

            items.forEach(item => {
                elements.push({
                    title: item.product.name,
                    image_url: item.product.image_url,
                    subtitle: `${item.product.description} \n Quantity: ${item.quantity}`,
                    buttons: [
                        {
                            type: 'postback',
                            payload: item.product.name,
                            title: 'Change Quantity'
                        },
                        {
                            type: 'postback',
                            payload: item.product.name,
                            title: 'Remove'
                        }
                    ]
                })
            })

            const payload = {
                facebook: {
                    attachment: {
                        type: 'template',
                        payload: {
                            template_type: 'generic',
                            elements: elements
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

export default onShowCart

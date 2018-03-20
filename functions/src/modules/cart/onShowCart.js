import { getCartItems } from '../../api/firebase'

const getResponse = (items) => {
    let responseToUser = {}
    if (items.length > 0) {
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
                        payload: `Remove ${item.product.name}`,
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
        responseToUser = { payload }
    } else {
        const payload = {
            facebook: {
                text: 'There are no items in this cart.',
                quick_replies: [
                    {
                        content_type: 'text',
                        title: 'Show menu',
                        payload: 'Show menu'
                    }
                ]
            }
        }
        responseToUser = { payload }
    }
    return responseToUser
}

const onShowCart = (args, sendResponse) => {
    const { senderId } = args
    if (senderId) {
        getCartItems(senderId).then(items => {
            const responseToUser = getResponse(items)
            sendResponse({ responseToUser, ...args })
        })
    } else {
        console.error('Invalid state: ' + JSON.stringify(args))
    }
}

export default onShowCart

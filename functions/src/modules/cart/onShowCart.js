import { getCartItems } from '../../api/firebase'

const getResponse = (items) => {
    let responseToUser = {}
    if (items.length > 0) {
        const elements = items.map(item => {
            const { id, quantity, product, productType } = item

            const productTypeDescription = productType.description || ''
            const productDescription = product && product.description ? ` (${product.description})` : ''
            const title = `${productType.name}${productDescription}`

            return {
                title,
                image_url: productType.image_url,
                subtitle: `Quantity: ${quantity} \n${productTypeDescription}`,
                buttons: [
                    {
                        type: 'postback',
                        payload: `Change Quantity of Cart Item ${id} ${productType.name}`,
                        title: 'Change Quantity'
                    },
                    {
                        type: 'postback',
                        payload: `Remove Cart Item: ${id}`,
                        title: 'Remove'
                    }
                ]
            }
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
                text: 'There are no items in your cart.',
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

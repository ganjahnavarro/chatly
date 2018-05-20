import api from '../../api'

const { getCartItems } = api

const getResponse = (items) => {
    let responseToCustomer = {}
    if (items.length > 0) {
        const elements = items.map(item => {
            const { _id, quantity, product, product_type: productType } = item

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
                        payload: `Change Quantity of Cart Item ${_id} ${productType.name}`,
                        title: 'Change Quantity'
                    },
                    {
                        type: 'postback',
                        payload: `Remove Cart Item: ${_id}`,
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
        responseToCustomer = { payload }
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
        responseToCustomer = { payload }
    }
    return responseToCustomer
}

const onShowCart = (args, sendResponse) => {
    const { senderId } = args
    if (senderId) {
        getCartItems(senderId).then(items => {
            const responseToCustomer = getResponse(items)
            sendResponse({ responseToCustomer, ...args })
        })
    } else {
        console.error('Invalid state: ' + JSON.stringify(args))
    }
}

export default onShowCart

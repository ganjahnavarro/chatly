import onShowCategories from './onShowCategories'
import api from '../../api'

const { getCategories, getProductTypes } = api

export default (args, sendResponse) => {
    const { parameters } = args
    const { category } = parameters

    getCategories().then(categories => {
        const selectedCategory = categories.find(item => item.name.toLowerCase() === category.toLowerCase())
        console.log('Selected Category: ', JSON.stringify(selectedCategory))

        if (selectedCategory) {
            getProductTypes(selectedCategory._id).then(productTypes => {
                const elements = productTypes.map(item => {
                    return {
                        title: item.name,
                        image_url: item.image_url,
                        subtitle: `${item.price ? `Price: ${parseFloat(item.price).toFixed(2)} \n` : ''}${item.description}`,
                        buttons: [
                            {
                                type: 'postback',
                                payload: `I want to order ${item.name}`,
                                title: 'Add to Cart'
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

                const responseToCustomer = { payload }
                sendResponse({ responseToCustomer, ...args })
            })
        } else {
            onShowCategories(args, sendResponse)
        }
    })
}

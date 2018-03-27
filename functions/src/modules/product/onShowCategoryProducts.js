import onShowCategories from './onShowCategories'
import { getCategories, getProductTypes } from '../../api/firebase'

export default (args, sendResponse) => {
    const { parameters } = args
    const { category } = parameters

    getCategories().then(categories => {
        const selectedCategory = categories.find(item => item.name.toLowerCase() === category.toLowerCase())
        console.log('Selected Category: ', JSON.stringify(selectedCategory))

        if (selectedCategory) {
            getProductTypes().then(productTypes => {
                const categoryProducts = productTypes
                    .filter(productType => productType.category_id === selectedCategory.id)

                const elements = categoryProducts.map(item => {
                    return {
                        title: item.name,
                        image_url: item.image_url,
                        subtitle: item.description,
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

                const responseToUser = { payload }
                sendResponse({ responseToUser, ...args })
            })
        } else {
            onShowCategories(args, sendResponse)
        }
    })
}

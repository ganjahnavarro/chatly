import onShowCategories from './onShowCategories'
import { getCategories, getProducts } from '../../api/firebase'

export default (args, sendResponse) => {
    const { parameters } = args
    const { category } = parameters

    getCategories().then(categories => {
        const selectedCategory = categories.find(item => item.name.toLowerCase() === category.toLowerCase())
        console.log('Selected Category: ', JSON.stringify(selectedCategory))

        if (selectedCategory) {
            getProducts().then(products => {
                const categoryProducts = products.filter(product => product.categoryId === selectedCategory.id)
                const elements = []
                categoryProducts.forEach(item => {
                    elements.push({
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
            onShowCategories(args, sendResponse)
        }
    })
}

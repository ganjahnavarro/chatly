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
                console.log('Products:', JSON.stringify(products))
                const categoryProducts = products.filter(product => product.categoryId === selectedCategory.id)

                console.log('Category products:', JSON.stringify(categoryProducts))
                sendResponse({ responseToUser: `Category products count:  ${categoryProducts.length}`, ...args })
            })
        } else {
            onShowCategories(args, sendResponse)
        }
    })
}

import onShowCategories from './onShowCategories'
import onShowCategoryProducts from './onShowCategoryProducts'

export default (args, sendResponse) => {
    const { parameters } = args
    const { category } = parameters

    if (category !== null) {
        onShowCategoryProducts(args, sendResponse)
    } else {
        onShowCategories(args, sendResponse)
    }
}

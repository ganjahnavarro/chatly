import { categories, items } from './dummy'

const Firebase = {}

Firebase.getCategories = () => {
    return categories
}

Firebase.getItems = () => {
    return items
}

Firebase.getCategoryItems = (categoryId) => {
    return items.filter(item => item.categoryId === categoryId)
}

Firebase.getItem = (itemId) => {
    return items.find(item => item.id === itemId)
}

export default Firebase

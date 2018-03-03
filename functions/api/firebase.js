import { categories, items } from './dummy';

const Firebase = {};

Firebase.getCategories = () => {
    return categories;
};

Firebase.getItems = () => {
    return items;
};

Firebase.getCategoryItems = (categoryId) => {
    return items.filter(item => item.categoryId === categoryId);
};

export default Firebase;

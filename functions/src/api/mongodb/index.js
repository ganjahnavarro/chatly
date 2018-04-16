import { getBranches } from './modules/branches'
import { recordRequest, recordResponse } from './modules/conversations'
import { getSessionDetails, updateSessionDetails } from './modules/sessions'
import { getUserDetails, updateUserDetails } from './modules/users'
import { getCategories, getCategory } from './modules/categories'
import { getProductTypes, getProductType } from './modules/productTypes'
import { getProductTypeAttributes, getAttribute } from './modules/attributes'
import { getCartItems, getCartItem, addCartItem, hasCartItems } from './modules/cart'

export default {
    getBranches,

    getCategory,
    getCategories,

    getProductType,
    getProductTypes,

    getAttribute,
    getProductTypeAttributes,

    getCartItem,
    getCartItems,
    hasCartItems,

    getSessionDetails,
    updateSessionDetails,

    getUserDetails,
    updateUserDetails,

    addCartItem,

    recordRequest,
    recordResponse
}

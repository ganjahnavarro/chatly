import { getBranches } from './modules/branches'
import { recordRequest, recordResponse } from './modules/conversations'
import { getSessionDetails, updateSessionDetails } from './modules/sessions'
import { getUserDetails, updateUserDetails } from './modules/users'
import { getCategories, getCategory } from './modules/categories'
import { getProductTypes, getProductType } from './modules/productTypes'
import { getProductTypeAttributes, getAttribute } from './modules/attributes'
import { getPromoCode } from './modules/promos'
import { getCompany } from './modules/company'

import { getCartItems, getCartItem, addCartItem, updateCartItem, hasCartItems,
    removeCartItems, removeCartItem, removeCartItemById } from './modules/cart'

import { getUserOrders, getUserOrderById, getUserOrderByDocumentNo,
    addOrder, updateOrderDetails, updateOrderStatusHistory } from './modules/order'

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

    removeCartItem,
    removeCartItems,
    removeCartItemById,

    getSessionDetails,
    updateSessionDetails,

    getUserDetails,
    updateUserDetails,

    addCartItem,
    updateCartItem,

    addOrder,
    getUserOrders,
    getUserOrderById,
    getUserOrderByDocumentNo,

    updateOrderDetails,
    updateOrderStatusHistory,

    recordRequest,
    recordResponse,

    getPromoCode,
    getCompany
}

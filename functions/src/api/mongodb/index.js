import { addBranch, updateBranch, deleteBranch, getBranches, getBranch } from './modules/branches'
import { recordRequest, recordResponse } from './modules/conversations'
import { getSessionDetails, updateSessionDetails } from './modules/sessions'
import { getUserDetails, updateUserDetails } from './modules/users'
import { addCategory, updateCategory, deleteCategory, getCategories, getCategory } from './modules/categories'
import { getProductTypes, getProductType } from './modules/productTypes'
import { getProductTypeAttributes, getAttribute } from './modules/attributes'
import { getPromoCode } from './modules/promos'
import { getCompany } from './modules/company'

import { getCartItems, addCartItem, updateCartItemQuantity, hasCartItems,
    removeCartItems, removeCartItem, removeCartItemById } from './modules/cart'

import { getUserOrders, getUserOrderByDocumentNo,
    addOrder, updateOrderDetails, updateOrderStatusHistory } from './modules/order'

export default {
    addBranch,
    updateBranch,
    deleteBranch,
    getBranches,
    getBranch,

    addCategory,
    updateCategory,
    deleteCategory,
    getCategories,
    getCategory,

    getProductType,
    getProductTypes,

    getAttribute,
    getProductTypeAttributes,

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
    updateCartItemQuantity,

    addOrder,
    getUserOrders,
    getUserOrderByDocumentNo,

    updateOrderDetails,
    updateOrderStatusHistory,

    recordRequest,
    recordResponse,

    getPromoCode,
    getCompany
}

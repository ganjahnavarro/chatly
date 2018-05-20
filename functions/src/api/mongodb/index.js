import * as branches from './modules/branches'
import * as conversations from './modules/conversations'
import * as sessions from './modules/sessions'
import * as customers from './modules/customers'
import * as categories from './modules/categories'
import * as productTypes from './modules/productTypes'
import * as attributes from './modules/attributes'
import * as promos from './modules/promos'
import * as companies from './modules/companies'
import * as cart from './modules/cart'
import * as orders from './modules/orders'
import * as users from './modules/users'

export default {
    ...branches,
    ...categories,
    ...productTypes,
    ...attributes,
    ...cart,
    ...sessions,
    ...customers,
    ...orders,
    ...conversations,
    ...promos,
    ...companies,
    ...users
}

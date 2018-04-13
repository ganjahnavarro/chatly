import { recordRequest, recordResponse } from './modules/conversations'
import { updateSessionDetails } from './modules/sessions'
import { updateUserDetails } from './modules/users'
import { getCategories, getCategory } from './modules/categories'

export default {
    getCategory,
    getCategories,

    updateSessionDetails,
    updateUserDetails,

    recordRequest,
    recordResponse
}

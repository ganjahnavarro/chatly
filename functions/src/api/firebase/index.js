import moment from 'moment'

import * as admin from 'firebase-admin'
import * as firebase from 'firebase'
import * as functions from 'firebase-functions'
import Promise from 'promise'

import { toArray } from '../../utils'

admin.initializeApp(functions.config().firebase)
firebase.initializeApp(functions.config().firebase)

const database = firebase.database()

const updateUserDetails = (senderId, data) => {
    database.ref(`users/${senderId}`).update(data)
}

const updateSessionDetails = (senderId, data) => {
    database.ref(`sessions/${senderId}`).update(data)
}

const getBranches = () => getItems('branches')
const getCategories = () => getItems('categories')
const getProductTypes = () => getItems('product_types')

const getProductTypeAttributes = (productType) => {
    return new Promise((resolve, reject) => {
        database.ref(`product_types/${productType.id}/attributes`).once('value', snapshot => {
            if (snapshot.val()) {
                let promises = []

                const keys = Object.keys(snapshot.val())
                keys.forEach(key => {
                    const attributeId = productType.attributes[key].attribute_id
                    promises.push(getAttribute(attributeId))
                })
                Promise.all(promises).then(items => resolve(items))
            } else {
                resolve()
            }
        })
    })
}

const getAttribute = (attributeId) => {
    const attributeRef = database.ref(`attributes/${attributeId}`)
    return new Promise((resolve, reject) => {
        attributeRef.once('value', snapshot => {
            const attribute = {
                ...snapshot.val(),
                id: attributeId
            }
            resolve(attribute)
        })
    })
}

const getItems = key => {
    return new Promise((resolve, reject) => {
        database.ref(key).once('value', snapshot => {
            resolve(toArray(snapshot.val()))
        })
    })
}

const getCategory = categoryKey => {
    const categoryRef = database.ref(`categories/${categoryKey}`)
    return new Promise((resolve, reject) => {
        categoryRef.once('value', snapshot => {
            resolve({
                ...snapshot.val(),
                id: categoryKey
            })
        })
    })
}

const getProductType = productTypeKey => {
    const productTypesRef = database.ref(`product_types/${productTypeKey}`)
    return new Promise((resolve, reject) => {
        productTypesRef.once('value', snapshot => {
            const { category_id: categoryKey, ...rest } = snapshot.val()
            getCategory(categoryKey).then(res => {
                resolve({
                    ...rest,
                    category: res,
                    id: productTypeKey
                })
            })
        })
    })
}

const getCartItem = (senderId, cartItemKey, includeAttributes) => {
    const sessionRef = database.ref(
        `sessions/${senderId}/cart/${cartItemKey}`
    )

    return new Promise((resolve, reject) => {
        sessionRef.once('value', snapshot => {
            const {
                product_id: productKey,
                product_type_id: productTypeKey,
                ...rest
            } = snapshot.val()

            getProductType(productTypeKey).then(productType => {
                const cartItem = {
                    ...rest,
                    productType,
                    id: cartItemKey
                }

                if (productKey && productType.products) {
                    cartItem.product = {
                        ...productType.products[productKey],
                        id: productKey
                    }
                }

                if (includeAttributes && productType.attributes) {
                    const promises = toArray(productType.attributes)
                        .map(attribute => getAttribute(attribute.attribute_id))

                    Promise.all(promises).then(items => {
                        const attributes = productType.attributes
                        Object.keys(attributes).forEach(attributeKey => {
                            const attribute = items.find(item => item.id === attributes[attributeKey].attribute_id)
                            cartItem.productType.attributes[attributeKey] = attribute
                        })

                        let values = []
                        items.forEach(item => {
                            values = values.concat(toArray(item.values))
                        })

                        const products = productType.products
                        Object.keys(products).forEach(productKey => {
                            const attributeValues = products[productKey].attribute_values
                            Object.keys(attributeValues).forEach(attributeValueKey => {
                                const attributeValue = values.find(value => {
                                    return value.id === attributeValues[attributeValueKey].attribute_value_id
                                })

                                attributeValues[attributeValueKey] = attributeValue
                                cartItem.productType.products[productKey] = attributeValues[attributeValueKey]
                            })
                        })
                        resolve(cartItem)
                    })
                } else {
                    resolve(cartItem)
                }
            })
        })
    })
}

const hasCartItems = (senderId) => {
    return new Promise((resolve, reject) => {
        database.ref(`sessions/${senderId}/cart`).once('value', snapshot => resolve(snapshot.exists()))
    })
}

const getCartItems = (senderId, includeAttributes) => {
    return new Promise((resolve, reject) => {
        const senderRef = database.ref(`sessions/${senderId}`)
        senderRef.once('value', (senderSnapshot) => {
            if (senderSnapshot.hasChild('cart')) {
                const cartRef = database.ref(`sessions/${senderId}/cart`)
                cartRef.once('value', cartSnapshot => {
                    const keys = Object.keys(cartSnapshot.val())
                    const promises = keys.map(key => getCartItem(senderId, key, includeAttributes))
                    Promise.all(promises).then(items => resolve(items))
                })
            } else {
                resolve([])
            }
        })
    })
}

const removeCartItem = (senderId, productType) => {
    const cartRef = database.ref(`sessions/${senderId}/cart`)

    return new Promise((resolve, reject) => {
        getCartItems(senderId).then(items => {
            items.forEach(item => {
                console.log(item.productType.name, productType,
                    `matched: ${item.productType.name.toLowerCase() === productType.toLowerCase()}`, item.id)

                if (item.productType.name.toLowerCase() === productType.toLowerCase()) {
                    console.log(`Removing cart item by product type: ${item.id}`)
                    cartRef.child(item.id).remove()
                }
            })
        })
        resolve()
    })
}

const removeCartItems = (senderId) => {
    return database.ref(`sessions/${senderId}/cart`).remove()
}

const removeCartItemById = (senderId, cartItem) => {
    console.log(`Removing cart item by ID: ${cartItem}`)
    return database.ref(`sessions/${senderId}/cart/${cartItem}`).remove()
}

const getSessionDetails = (senderId) => {
    return new Promise((resolve, reject) => {
        const sessionRef = database.ref(`sessions/${senderId}`)

        sessionRef.once('value', snapshot => {
            resolve(snapshot.val())
        })
    })
}

const getUserDetails = (senderId) => {
    return new Promise((resolve, reject) => {
        const sessionRef = database.ref(`users/${senderId}`)

        sessionRef.once('value', snapshot => {
            resolve(snapshot.val())
        })
    })
}

const updateCartItem = (senderId, id, data) => {
    database.ref(`sessions/${senderId}/cart/${id}`).update(data)
}

const addCartItem = (senderId, cartItem) => {
    database.ref(`sessions/${senderId}/cart`).push(cartItem)
}

const getPromoCode = (promoCode, timestamp) => {
    return new Promise((resolve, reject) => {
        database.ref('promos').once('value').then(snapshot => {
            const promos = toArray(snapshot.val())
            const selectedPromo = promos.find(promo => {
                if (promo.code === promoCode && promo.active) {
                    const requestDate = moment(timestamp)
                    const startDate = moment(promo.start_date, 'YYYY-MM-DD HH:mm')
                    const endDate = moment(promo.end_date, 'YYYY-MM-DD HH:mm')
                    return requestDate.isBetween(startDate, endDate)
                }
                return false
            })
            resolve(selectedPromo)
        })
    })
}

const addOrder = (senderId, order) => {
    const orderRef = database.ref(`orders/${senderId}`).push(order)
    return orderRef.key
}

const getUserOrders = (senderId) => {
    return new Promise((resolve, reject) => {
        database.ref(`orders/${senderId}`).once('value', snapshot => {
            if (snapshot && snapshot.val()) {
                resolve(toArray(snapshot.val()))
            } else {
                resolve([])
            }
        })
    })
}

const getUserOrderByKey = (senderId, orderKey) => {
    return new Promise((resolve, reject) => {
        database.ref(`orders/${senderId}/${orderKey}`)
            .once('value', snapshot => resolve(snapshot.val()))
    })
}

const getUserOrderByDocumentNo = (senderId, documentNo) => {
    return new Promise((resolve, reject) => {
        database.ref(`orders/${senderId}`).once('value', snapshot => {
            if (snapshot && snapshot.val()) {
                const orders = toArray(snapshot.val())
                const order = orders.find(order => String(order.document_no) === documentNo)
                resolve(order)
            }
        })
    })
}

const updateOrderDetails = (senderId, id, data) => {
    database.ref(`orders/${senderId}/${id}`).update(data)
}

const updateOrderStatusHistory = (senderId, id, data) => {
    database.ref(`orders/${senderId}/${id}/status_history`).push(data)
}

const getCompany = () => {
    return new Promise((resolve, reject) => {
        database.ref('company').once('value', snapshot => {
            resolve(snapshot.val())
        })
    })
}

const recordRequest = (request, args) => {
    try {
        const { senderId, timestamp } = args

        if (senderId) {
            const message = {
                content: JSON.stringify(request.body),
                type: 'request'
            }
            if (timestamp) {
                message.timestamp = timestamp
            }
            database.ref(`conversations/${senderId}`).push(message)
        }
    } catch (error) {
        console.error('Error recording request', error)
    }
}

const recordResponse = (senderId, timestamp, responseJson) => {
    try {
        if (senderId) {
            const message = {
                content: JSON.stringify(responseJson),
                type: 'response'
            }
            if (timestamp) {
                message.timestamp = timestamp
            }
            database.ref(`conversations/${senderId}`).push(message)
        }
    } catch (error) {
        console.error('Error recording response', error)
    }
}

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
    getUserOrderByKey,
    getUserOrderByDocumentNo,

    updateOrderDetails,
    updateOrderStatusHistory,

    recordRequest,
    recordResponse,

    getPromoCode,
    getCompany
}

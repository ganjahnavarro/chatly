import * as admin from 'firebase-admin'
import * as firebase from 'firebase'
import * as functions from 'firebase-functions'
import Promise from 'promise'

import { toArray } from '../utils'

admin.initializeApp(functions.config().firebase)
firebase.initializeApp(functions.config().firebase)

export const database = firebase.database()

export const saveUserDetails = (senderId, data) => {
    database.ref(`users/${senderId}`).set(data)
}

export const getBranches = () => getItems('branches')
export const getCategories = () => getItems('categories')
export const getProductTypes = () => getItems('product_types')

export const getProductTypeAttributes = (productType) => {
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

export const getCategory = categoryKey => {
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

export const getProductType = productTypeKey => {
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

export const getCartItem = (senderId, cartItemKey, includeAttributes) => {
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

export const getCartItems = (senderId, includeAttributes) => {
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

export const removeCartItem = (senderId, productType) => {
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

export const removeCartItemById = (senderId, cartItem) => {
    console.log(`Removing cart item by ID: ${cartItem}`)
    return database.ref(`sessions/${senderId}/cart/${cartItem}`).remove()
}

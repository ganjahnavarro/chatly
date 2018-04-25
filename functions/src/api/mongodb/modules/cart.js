import { ObjectId } from 'mongodb'
import Client from '../database'

export const addCartItem = (senderId, cartItem) => {
    const newCartItem = {
        _id: ObjectId(),
        ...cartItem
    }

    Client.getCollection('sessions').update(
        { senderId },
        {
            $set: { senderId },
            $push: { cart: newCartItem }
        },
        { upsert: true }
    )
}

export const hasCartItems = senderId => {
    return new Promise((resolve, reject) => {
        const projection = { cart: 1 }
        Client
            .getCollection('sessions')
            .findOne({ senderId }, { projection }, (err, data) => {
                if (err) {
                    throw err
                }
                resolve(data.cart && data.cart.length > 0)
            })
    })
}

export const updateCartItemQuantity = (senderId, cartItemId, quantity) => {
    Client.getCollection('sessions').update(
        {
            senderId,
            'cart._id': ObjectId(cartItemId)
        },
        {
            $set: {
                'cart.$.quantity': quantity
            }
        },
        { upsert: true }
    )
}

export const removeCartItem = (senderId, productTypeName) => {
    return new Promise((resolve, reject) => {
        Client
            .getCollection('product_types')
            .findOne({ name: productTypeName }, (err, data) => {
                if (err) {
                    throw err
                }

                Client.getCollection('sessions').update(
                    { senderId },
                    { $pull: { 'cart': { product_type_id: data._id } } }
                )
                resolve()
            })
    })
}

const getCartItemsPromise = senderId => new Promise((resolve, reject) => {
    Client.getCollection('sessions').aggregate([
        { $match: { senderId } },
        { $project: { cart: 1, _id: 0 } },
        { $unwind: '$cart' },
        {
            $lookup: {
                from: 'product_types',
                localField: 'cart.product_type_id',
                foreignField: '_id',
                as: 'cart.product_type'
            }
        },
        { $unwind: '$cart.product_type' },
        {
            $group: {
                _id: null,
                cart: {
                    $push: '$cart'
                }
            }
        },
        { $project: { cart: 1, _id: 0 } }
    ]).next((err, data) => {
        if (err) {
            throw err
        }
        resolve(data ? data.cart : [])
    })
})

const getAttributes = objectIds => new Promise((resolve, reject) => {
    Client.getCollection('attributes')
        .find({
            _id: { $in: objectIds }
        })
        .toArray((err, data) => {
            if (err) {
                throw err
            }
            resolve(data)
        })
})

export const getCartItems = (senderId, includeAttributes) => {
    return new Promise((resolve, reject) => {
        getCartItemsPromise(senderId).then(items => {
            if (includeAttributes) {
                let attributeIds = []
                items.forEach(item => {
                    if (item.product_type.attributes) {
                        const objectIds = item.product_type.attributes.map(id => ObjectId(id))
                        attributeIds = attributeIds.concat(objectIds)
                    }
                })

                getAttributes(attributeIds).then(cartAttributes => {
                    const reducer = (accumulated, current) => accumulated.concat(current.values)
                    const cartAttributeValues = cartAttributes.reduce(reducer, [])

                    const mapAttribute = attribute => cartAttributes
                        .find(cartAttribute => cartAttribute._id.equals(attribute))

                    const mapAttributeValue = attributeValue => cartAttributeValues
                        .find(cartAttributeValue => cartAttributeValue._id.equals(attributeValue))

                    const mapProduct = product => {
                        const { attribute_values: attributeValues, ...productDetails } = product
                        return {
                            ...productDetails,
                            attribute_values: attributeValues.map(mapAttributeValue)
                        }
                    }

                    const detailedItems = items.map(item => {
                        const { product_type: productType, ...itemDetails } = item
                        const { attributes, products, ...productTypeDetails } = productType
                        return {
                            ...itemDetails,
                            product_type: {
                                ...productTypeDetails,
                                attributes: attributes.map(mapAttribute),
                                products: products.map(mapProduct)
                            }
                        }
                    })
                    resolve(detailedItems)
                })
            } else {
                resolve(items)
            }
        })
    })
}

export const removeCartItemById = (senderId, cartItemId) => {
    console.log(`Removing cart item by ID: ${cartItemId}`)

    return new Promise((resolve, reject) => {
        Client.getCollection('sessions').update(
            { senderId },
            {
                $pull: {
                    cart: { _id: ObjectId(cartItemId) }
                }
            }
        )
        resolve()
    })
}

export const removeCartItems = senderId => {
    return new Promise((resolve, reject) => {
        Client.getCollection('sessions').update(
            { senderId },
            {
                $unset: { cart: 1 }
            }
        )
        resolve()
    })
}

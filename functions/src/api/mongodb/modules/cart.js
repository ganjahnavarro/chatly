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

/*

const updateCartItem = (senderId, id, data) => {
    database.ref(`sessions/${senderId}/cart/${id}`).update(data)
}

export const getCartItems = (senderId, includeAttributes) => {
    return new Promise((resolve, reject) => {
        Client.getCollection('sessions').aggregate([
            { $match: { senderId } },
            { $unwind: '$cart' },
            {
                $lookup: {
                    from: 'product_types',
                    localField: 'cart.product_type_id',
                    foreignField: '_id',
                    as: 'product_type'
                }
            }
        ]).toArray((err, data) => {
            if (err) {
                throw err
            }
            console.log(data)
            resolve(data)
        })
    })
}

export const getCartItem = (senderId, cartItemId, includeAttributes) => {
    return new Promise((resolve, reject) => {
        const projection = {
            cart: {
                $elemMatch: { _id: ObjectId(cartItemId) }
            }
        }

        Client.getCollection('sessions').findOne({ senderId }, { projection }, (err, data) => {
            if (err) {
                throw err
            }
            console.log('getCartItem', data)
            resolve(data)
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

*/

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

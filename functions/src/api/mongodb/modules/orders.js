import { ObjectId } from 'mongodb'
import Client from '../database'

const getCollection = () => Client.getCollection('orders')

export const addOrder = (order) => {
    const newOrder = order
    newOrder.status_history = newOrder.status_history.map(item => {
        return { _id: ObjectId(), ...item }
    })
    getCollection().insert(newOrder)
}

export const getUserOrders = (senderId) => {
    return new Promise((resolve, reject) => {
        getCollection().find({ senderId }).toArray((err, data) => {
            if (err) {
                throw err
            }
            resolve(data)
        })
    })
}

export const getUserOrderByDocumentNo = (senderId, documentNo) => {
    return new Promise((resolve, reject) => {
        const criteria = { senderId, document_no: documentNo }
        getCollection().findOne(criteria, (err, data) => {
            if (err) {
                throw err
            }
            resolve(data)
        })
    })
}

export const updateOrderDetails = (id, data) => {
    getCollection().update(
        ObjectId(id),
        { $set: data },
        { upsert: true }
    )
}

export const updateOrderStatusHistory = (id, data) => {
    const newStatusHistory = {
        _id: ObjectId(),
        ...data
    }

    getCollection().update(
        ObjectId(id),
        {
            $push: { status_history: newStatusHistory }
        },
        { upsert: true }
    )
}

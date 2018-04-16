import { ObjectId } from 'mongodb'
import Client from '../database'

export const getProductTypes = categoryId => {
    const queryFilter = categoryId ? { category_id: ObjectId(categoryId) } : undefined
    return new Promise((resolve, reject) => {
        Client
            .getCollection('product_types')
            .find(queryFilter)
            .toArray((err, data) => {
                if (err) {
                    throw err
                }
                resolve(data)
            })
    })
}

export const getProductType = id => {
    return new Promise((resolve, reject) => {
        Client
            .getCollection('product_types')
            .findOne(ObjectId(id), (err, data) => {
                if (err) {
                    throw err
                }
                resolve(data)
            })
    })
}

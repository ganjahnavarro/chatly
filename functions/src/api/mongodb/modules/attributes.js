import { ObjectId } from 'mongodb'
import Client from '../database'

export const getAttribute = id => {
    return new Promise((resolve, reject) => {
        Client.getCollection('attributes').findOne(ObjectId(id), (err, data) => {
            if (err) {
                throw err
            }
            resolve(data)
        })
    })
}

export const getProductTypeAttributes = productType => {
    return new Promise((resolve, reject) => {
        const getAttributesByIds = ids => {
            Client
                .getCollection('attributes')
                .find({ _id: { $in: ids } })
                .toArray((err, data) => {
                    if (err) {
                        throw err
                    }
                    resolve(data)
                })
        }

        const projection = { attributes: 1, _id: 0 }
        Client
            .getCollection('product_types')
            .findOne(ObjectId(productType._id), { projection }, (err, data) => {
                if (err) {
                    throw err
                }

                if (data.attributes) {
                    getAttributesByIds(data.attributes)
                } else {
                    resolve([])
                }
            })
    })
}

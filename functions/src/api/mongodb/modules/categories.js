import { ObjectId } from 'mongodb'
import Client from '../database'

export const getCategories = () => {
    return new Promise((resolve, reject) => {
        Client.getCollection('categories').find().toArray((err, data) => {
            if (err) {
                throw err
            }
            resolve(data)
        })
    })
}

export const getCategory = id => {
    return new Promise((resolve, reject) => {
        Client.getCollection('categories').findOne(ObjectId(id), (err, data) => {
            if (err) {
                throw err
            }
            resolve(data)
        })
    })
}

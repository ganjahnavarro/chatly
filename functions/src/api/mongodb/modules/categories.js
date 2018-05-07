import { ObjectId } from 'mongodb'
import Client from '../database'

export const getCategories = () => {
    return new Promise((resolve, reject) => {
        Client
            .getCollection('categories')
            .find({ deleted: false })
            .toArray((err, data) => {
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

export const addCategory = data => {
    Client.getCollection('categories').insert({ ...data, deleted: false })
}

export const updateCategory = (id, data) => {
    Client.getCollection('categories').update(
        { _id: ObjectId(id) },
        { $set: data }
    )
}

export const deleteCategory = id => {
    updateCategory(id, { deleted: true })
}

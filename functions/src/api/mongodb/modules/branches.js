import { ObjectId } from 'mongodb'
import Client from '../database'

export const getBranches = () => {
    return new Promise((resolve, reject) => {
        Client
            .getCollection('branches')
            .find({ deleted: false })
            .toArray((err, data) => {
                if (err) {
                    throw err
                }
                resolve(data)
            })
    })
}

export const getBranch = id => {
    return new Promise((resolve, reject) => {
        Client.getCollection('branches').findOne(ObjectId(id), (err, data) => {
            if (err) {
                throw err
            }
            resolve(data)
        })
    })
}

export const addBranch = data => {
    Client.getCollection('branches').insert({ ...data, deleted: false })
}

export const updateBranch = (id, data) => {
    Client.getCollection('branches').update(
        { _id: ObjectId(id) },
        { $set: data }
    )
}

export const deleteBranch = id => {
    updateBranch(id, { deleted: true })
}

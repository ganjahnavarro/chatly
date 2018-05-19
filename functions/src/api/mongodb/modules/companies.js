import { ObjectId } from 'mongodb'
import Client from '../database'

export const getCompanies = () => {
    return new Promise((resolve, reject) => {
        Client
            .getCollection('companies')
            .find({ deleted: false })
            .toArray((err, data) => {
                if (err) {
                    throw err
                }
                resolve(data)
            })
    })
}

export const getCompany = () => {
    return new Promise((resolve, reject) => {
        Client.getCollection('companies').findOne({}, (err, data) => {
            if (err) {
                throw err
            }
            resolve(data)
        })
    })
}

export const addCompany = data => {
    Client.getCollection('companies').insert({ ...data, deleted: false })
}

export const updateCompany = (id, company) => {
    const { _id, ...data } = company
    Client.getCollection('companies').update(
        { _id: ObjectId(id) },
        { $set: data }
    )
}

export const deleteCompany = id => {
    updateCompany(id, { deleted: true })
}

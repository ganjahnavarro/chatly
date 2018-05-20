import { ObjectId } from 'mongodb'
import Client from '../database'

const getCollection = () => Client.getCollection('users')

export const getUser = id => {
    return new Promise((resolve, reject) => {
        getCollection().findOne(ObjectId(id), (err, data) => {
            if (err) {
                throw err
            }
            resolve(data)
        })
    })
}

export const getUserByUsername = username => {
    return new Promise((resolve, reject) => {
        getCollection().findOne({ username }, (err, data) => {
            if (err) {
                throw err
            }
            resolve(data)
        })
    })
}

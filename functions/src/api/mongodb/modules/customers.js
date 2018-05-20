import Client from '../database'

const getCollection = () => Client.getCollection('customers')

export const getCustomer = senderId => {
    return new Promise((resolve, reject) => {
        getCollection().findOne({ senderId }, (err, data) => {
            if (err) {
                throw err
            }
            resolve(data)
        })
    })
}

export const updateCustomer = (senderId, data) => {
    getCollection().update(
        { senderId },
        {
            $set: { ...data, senderId }
        },
        { upsert: true }
    )
}

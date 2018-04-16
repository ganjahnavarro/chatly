import Client from '../database'

export const getUserDetails = senderId => {
    return new Promise((resolve, reject) => {
        Client
            .getCollection('users')
            .findOne({ senderId }, (err, data) => {
                if (err) {
                    throw err
                }
                resolve(data)
            })
    })
}

export const updateUserDetails = (senderId, data) => {
    Client.getCollection('users').update(
        { senderId },
        {
            $set: { ...data, senderId }
        },
        { upsert: true }
    )
}

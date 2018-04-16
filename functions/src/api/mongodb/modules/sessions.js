import Client from '../database'

export const getSessionDetails = senderId => {
    return new Promise((resolve, reject) => {
        Client
            .getCollection('sessions')
            .findOne({ senderId }, (err, data) => {
                if (err) {
                    throw err
                }
                resolve(data)
            })
    })
}

export const updateSessionDetails = (senderId, data) => {
    Client.getCollection('sessions').update(
        { senderId },
        {
            $set: { ...data, senderId }
        },
        { upsert: true }
    )
}

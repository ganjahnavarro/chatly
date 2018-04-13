import Client from '../database'

export const updateSessionDetails = (senderId, data) => {
    Client.getCollection('sessions').update(
        { senderId },
        { ...data, senderId },
        { upsert: true }
    )
}

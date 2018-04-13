import Client from '../database'

export const updateUserDetails = (senderId, data) => {
    Client.getCollection('users').update(
        { senderId },
        { ...data, senderId },
        { upsert: true }
    )
}

import database from '../database'

export const updateSessionDetails = (senderId, data) => {
    const collection = database.collection('sessions')
    collection.update({ senderId }, { $set: data })
}

import Client from '../database'

export const recordRequest = (request, args) => {
    try {
        const { senderId, timestamp } = args

        if (senderId) {
            const message = {
                senderId,
                content: request.body,
                type: 'request'
            }
            if (timestamp) {
                message.timestamp = timestamp
            }
            const collection = Client.getCollection('conversations')
            collection.insert(message)
        }
    } catch (error) {
        console.error('Error recording request', error)
    }
}

export const recordResponse = (senderId, timestamp, responseJson) => {
    try {
        if (senderId) {
            const message = {
                senderId,
                content: responseJson,
                type: 'response'
            }
            if (timestamp) {
                message.timestamp = timestamp
            }
            const collection = Client.getCollection('conversations')
            collection.insert(message)
        }
    } catch (error) {
        console.error('Error recording response', error)
    }
}

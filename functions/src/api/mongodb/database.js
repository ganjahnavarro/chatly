import { MongoClient } from 'mongodb'

const Client = {}

MongoClient.connect(process.env.MONGODB_CONNECTION_STRING, (err, rootDatabase) => {
    if (err) {
        throw err
    }

    Client.getCollection = (collectionName) => {
        const database = rootDatabase.db(process.env.MONGODB_DEFAULT_DATABASE)
        return database.collection(collectionName)
    }
})

export default Client

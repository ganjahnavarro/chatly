import { MongoClient } from 'mongodb'

const Client = {}

const uri = 'mongodb://localhost:27017/chatly'
const databaseName = 'chatly'

MongoClient.connect(uri, (err, rootDatabase) => {
    if (err) {
        throw err
    }

    Client.getCollection = (collectionName) => {
        const database = rootDatabase.db(databaseName)
        return database.collection(collectionName)
    }
})

export default Client

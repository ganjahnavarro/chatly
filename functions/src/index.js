const mongodb = require('mongodb')
const express = require('express')

const app = express()

const uri = 'mongodb://localhost:27017/chatly'
console.log(uri)

mongodb.MongoClient.connect(uri, (err, rootDatabase) => {
    if (err) {
        throw err
    }

    app.get('/chatly/:message', (req, res) => {
        const database = rootDatabase.db('chatly')
        const collection = database.collection('messages')

        const message = {
            timestamp: new Date().getTime(),
            message: req.params.message
        }

        collection.insert(message, (err) => {
            if (err) {
                throw err
            }

            collection.find().toArray((err, data) => {
                if (err) {
                    throw err
                }
                res.writeHead(200, {
                    'Content-Type': 'text/plain'
                })
                res.write('Messages:\n')
                res.end(JSON.stringify(data))
            })
        })
    })

    app.get('/_ah/health', (req, res) => {
        res.writeHead(200, {
            'Content-Type': 'text/plain'
        })
        res.write('OK')
        res.end()
    })

    app.listen(3000, () => console.log('Example app listening on port 3000!'))
})

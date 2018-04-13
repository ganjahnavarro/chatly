import {} from 'dotenv/config'

import express from 'express'
import bodyParser from 'body-parser'

import Controller from './controller'

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.post('/webhook', (req, res) => Controller.handle(req, res))

app.get('/_ah/health', (req, res) => {
    res.writeHead(200, {
        'Content-Type': 'text/plain'
    })

    res.write('OK')
    res.end()
})

app.listen(3000, () => console.log('App listening on port 3000!'))

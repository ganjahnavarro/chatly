import express from 'express'
import Controller from '../controller'

import branches from './branches'
import categories from './categories'

const routes = express.Router()

routes.get('/', (req, res) => {
    res.status(200).json({ message: 'Connected!' })
})

routes.use('/branches', branches)
routes.use('/categories', categories)

routes.post('/webhook', (req, res) => Controller.handle(req, res))

routes.get('/_ah/health', (req, res) => {
    res.writeHead(200, {
        'Content-Type': 'text/plain'
    })

    res.write('OK')
    res.end()
})

module.exports = routes

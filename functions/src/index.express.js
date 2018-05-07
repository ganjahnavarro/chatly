import {} from 'dotenv/config'

import express from 'express'
import bodyParser from 'body-parser'
import routes from './routes'

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/', routes)

const port = 3100
app.listen(port, () => console.log(`App listening on port ${port}!`))

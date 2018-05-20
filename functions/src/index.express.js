import {} from 'dotenv/config'

import express from 'express'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import session from 'express-session'

import passport from 'passport'
import { Strategy } from 'passport-local'

import routes from './routes'
import api from './api'

const { getUserByUsername, getUser } = api

/*
    Configure the local strategy for use by Passport.

    The local strategy require a `verify` function which receives the credentials
    (`username` and `password`) submitted by the user.  The function must verify
    that the password is correct and then invoke `cb` with a user object, which
    will be set at `req.user` in route handlers after authentication.
*/
passport.use(new Strategy(
    (username, password, cb) => {
        console.log('getting by username and password: ', username, password)
        getUserByUsername(username).then(user => {
            console.log('user', user)
            if (!user) return cb(null, false)
            if (user.password !== password) return cb(null, false)
            return cb(null, user)
        })
    }))

/*
    Configure Passport authenticated session persistence.

    In order to restore authentication state across HTTP requests, Passport needs
    to serialize users into and deserialize users out of the session.  The
    typical implementation of this is as simple as supplying the user ID when
    serializing, and querying the user record by ID from the database when deserializing.
*/
passport.serializeUser((user, cb) => cb(null, user._id))
passport.deserializeUser((id, cb) => getUser(id).then(user => cb(null, user)))

const app = express()
const MongoStore = require('connect-mongo')(session)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(morgan('combined'))
app.use(
    session({
        secret: process.env.EXPRESS_SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({
            url: process.env.MONGODB_CONNECTION_STRING,
            mongoOptions: { collection: 'authsession' }
        })
    })
)

app.use(passport.initialize())
app.use(passport.session())

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
    next()
})

app.use('/', routes)

const port = 3100
app.listen(port, () => console.log(`App listening on port ${port}!`))

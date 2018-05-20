import express from 'express'
import passport from 'passport'

import Controller from '../controller'

import branches from './branches'
import categories from './categories'
import companies from './companies'
import promos from './promos'

const routes = express.Router()

routes.get('/', (req, res) => {
    res.status(200).json({ message: 'Connected!' })
})

routes.use('/branches', branches)
routes.use('/categories', categories)
routes.use('/companies', companies)
routes.use('/promos', promos)

routes.post('/webhook', (req, res) => Controller.handle(req, res))

routes.post('/login',
    passport.authenticate('local'),
    (req, res) => console.log('Login success', req.user))

/*
routes.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err)
        if (!user) return res.redirect('/login')

        req.logIn(user, function(err) {
            if (err) return next(err)
            return res.redirect('/users/' + user.username);
        })
    })(req, res, next)
})

app.get('/logout',
    function(req, res){
        req.logout();
        res.redirect('/');
    });

app.get('/profile',
    require('connect-ensure-login').ensureLoggedIn(),
    function(req, res){
        res.render('profile', { user: req.user });
    });
*/

routes.get('/_ah/health', (req, res) => {
    res.writeHead(200, {
        'Content-Type': 'text/plain'
    })

    res.write('OK')
    res.end()
})

module.exports = routes

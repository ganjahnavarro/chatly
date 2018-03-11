'use strict'

const functions = require('firebase-functions')
const axios = require('axios')

const endpoint = 'https://graph.facebook.com/'
const version = 'v2.12'
const fields = ['first_name', 'last_name', 'profile_pic', 'locale', 'timezone', 'gender', 'is_payment_enabled', 'last_ad_referral']

export const getUserDetails = (senderId) => {
    console.log(`Getting user details. Sender ID: ${senderId}!`)

    const pageAccessToken = functions.config().messenger.page.access.token
    axios.get(`${endpoint}${version}/${senderId}`, {
        params: {
            fields: fields.join(','),
            access_token: pageAccessToken
        }
    }).then((response) => console.log(response.data)).catch(console.error)
}

'use strict'

import axios from 'axios'

import api from './'
const { updateCustomer } = api

const endpoint = 'https://graph.facebook.com/'
const version = 'v2.12'
const fields = ['first_name', 'last_name', 'profile_pic', 'locale', 'timezone', 'gender', 'is_payment_enabled', 'last_ad_referral']

export const getCustomer = (senderId) => {
    console.log(`Getting customer details. Sender ID: ${senderId}`)

    const onSuccess = (response) => {
        const data = response.data
        delete data.id
        updateCustomer(senderId, data)
    }

    const pageAccessToken = process.env.MESSENGER_PAGE_ACCESS_TOKEN
    if (pageAccessToken) {
        axios.get(`${endpoint}${version}/${senderId}`, {
            params: {
                fields: fields.join(','),
                access_token: pageAccessToken
            }
        }).then(onSuccess).catch(console.error)
    } else {
        throw new Error('No messenger config: messenger.page.access.token')
    }
}

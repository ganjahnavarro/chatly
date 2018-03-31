'use strict'

import * as functions from 'firebase-functions'
import axios from 'axios'

import { toArray } from '../utils'

const endpoint = 'https://api.dialogflow.com/v1/'
const version = '20170712'

export const createEntity = (attribute) => {
    const dialogflowConfig = functions.config().dialogflow

    if (dialogflowConfig) {
        const developerAccessToken = dialogflowConfig.developer.access.token

        const data = {
            name: attribute.name,
            entries: toArray(attribute.values).map(item => {
                const entry = { value: item.name }

                if (item.synonyms) {
                    entry.synonyms = toArray(item.synonyms).map(item => item.value)
                }
                return entry
            })
        }

        const url = `${endpoint}entities`
        const method = 'post'
        const params = { v: version }
        const headers = {
            'Authorization': `Bearer ${developerAccessToken}`,
            'Content-Type': 'application/json'
        }

        const config = { url, method, headers, params, data }

        return axios(config)
    } else {
        throw new Error('No messenger config: dialogflow.developer.access.token')
    }
}

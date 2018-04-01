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
            name: attribute.code,
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

export const createIntent = (attribute) => {
    const dialogflowConfig = functions.config().dialogflow
    if (dialogflowConfig) {
        console.log('ATTRIBUTE', toArray(attribute.values))
        const developerAccessToken = dialogflowConfig.developer.access.token
        const data = {
            'contexts': [],
            'events': [],
            'fallbackIntent': false,
            'priority': 500000,
            'name': attribute.name,
            'responses': [
                {
                    'resetContexts': false,
                    'action': 'order.product.add',
                    'affectedContexts': [
                        {
                            'name': 'product-added',
                            'parameters': {},
                            'lifespan': 1
                        }
                    ],
                    'parameters': [
                        {
                            'required': false,
                            'dataType': '@sys.number',
                            'name': 'quantity',
                            'value': '$quantity',
                            'isList': false
                        },
                        {
                            'required': false,
                            'dataType': '@product-type',
                            'name': 'product-type',
                            'value': '$product-type',
                            'isList': false
                        }
                    ],
                    'messages': [
                        {
                            'type': 0,
                            'speech': []
                        }
                    ],
                    'defaultResponsePlatforms': {},
                    'speech': []
                }
            ],
            'userSays': [
                {
                    'count': 0,
                    'isTemplate': false,
                    'isAuto': false,
                    'data': [
                        {
                            'text': 'Order ',
                            'userDefined': false
                        },
                        {
                            'text': '2',
                            'alias': 'quantity',
                            'meta': '@sys.number',
                            'userDefined': false
                        },
                        {
                            'text': ' ',
                            'userDefined': false
                        },
                        {
                            'text': toArray(attribute.values).length ? toArray(attribute.values)[0].name : 'attribute',
                            'alias': attribute.code,
                            'meta': `@${attribute.code}`,
                            'userDefined': false
                        },
                        {
                            'text': ' ',
                            'userDefined': false
                        },
                        {
                            'text': "chef's choice salad",
                            'alias': 'product-type',
                            'meta': '@product-type',
                            'userDefined': false
                        }
                    ]
                }
            ],
            'followUpIntents': [],
            'templates': [],
            'webhookForSlotFilling': false,
            'webhookUsed': false
        }

        const url = `${endpoint}intents`
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

'use strict'

import axios from 'axios'

import { toArray } from '../utils'

const endpoint = 'https://api.dialogflow.com/v1/'
const version = '20170712'

export const createEntity = attribute => {
    const developerAccessToken = process.env.DIALOGFLOW_DEV_ACCESS_TOKEN
    if (developerAccessToken) {
        const data = {
            name: attribute.code,
            entries: toArray(attribute.values).map(item => {
                const entry = { value: item.name }

                if (item.synonyms) {
                    entry.synonyms = toArray(item.synonyms).map(
                        item => item.value
                    )
                }
                return entry
            })
        }

        const url = `${endpoint}entities`
        const method = 'post'
        const params = { v: version }
        const headers = {
            Authorization: `Bearer ${developerAccessToken}`,
            'Content-Type': 'application/json'
        }

        const config = { url, method, headers, params, data }

        return axios(config)
    } else {
        throw new Error(
            'No config available: dialogflow.developer.access.token'
        )
    }
}

export const createIntent = attribute => {
    const developerAccessToken = process.env.DIALOGFLOW_DEV_ACCESS_TOKEN
    if (developerAccessToken) {
        console.log('ATTRIBUTE', toArray(attribute.values))
        const data = {
            contexts: [],
            events: [],
            fallbackIntent: false,
            priority: 500000,
            name: attribute.name,
            responses: [
                {
                    resetContexts: false,
                    action: 'order.product.add',
                    affectedContexts: [
                        {
                            name: 'product-added',
                            parameters: {},
                            lifespan: 1
                        }
                    ],
                    parameters: [
                        {
                            required: false,
                            dataType: '@sys.number',
                            name: 'quantity',
                            value: '$quantity',
                            isList: false
                        },
                        {
                            id: 'd5301933-4471-4b86-b126-8bafe0deaae0',
                            required: false,
                            dataType: `@${attribute.code}`,
                            name: toArray(attribute.values).length
                                ? toArray(attribute.values)[0].name
                                : 'attribute',
                            value: `$${attribute.code}`,
                            isList: false
                        },
                        {
                            required: false,
                            dataType: '@product-type',
                            name: 'product-type',
                            value: '$product-type',
                            isList: false
                        }
                    ],
                    messages: [
                        {
                            type: 0,
                            speech: []
                        }
                    ],
                    defaultResponsePlatforms: {},
                    speech: []
                }
            ],
            userSays: [
                {
                    count: 0,
                    isTemplate: false,
                    isAuto: false,
                    data: [
                        {
                            text: 'Order ',
                            userDefined: false
                        },
                        {
                            text: '2',
                            alias: 'quantity',
                            meta: '@sys.number',
                            userDefined: false
                        },
                        {
                            text: ' ',
                            userDefined: false
                        },
                        {
                            text: toArray(attribute.values).length
                                ? toArray(attribute.values)[0].name
                                : 'attribute',
                            alias: attribute.code,
                            meta: `@${attribute.code}`,
                            userDefined: false
                        },
                        {
                            text: ' ',
                            userDefined: false
                        },
                        {
                            text: "chef's choice salad",
                            alias: 'product-type',
                            meta: '@product-type',
                            userDefined: false
                        }
                    ]
                }
            ],
            followUpIntents: [],
            templates: [],
            webhookForSlotFilling: false,
            webhookUsed: false
        }

        const url = `${endpoint}intents`
        const method = 'post'
        const params = { v: version }
        const headers = {
            Authorization: `Bearer ${developerAccessToken}`,
            'Content-Type': 'application/json'
        }

        const config = { url, method, headers, params, data }

        return axios(config)
    } else {
        throw new Error(
            'No messenger config: dialogflow.developer.access.token'
        )
    }
}

export const getIntent = (id = 'bebbd90a-6893-4c24-8eaa-1c5b81ec4f0c') => {
    const developerAccessToken = process.env.DIALOGFLOW_DEV_ACCESS_TOKEN
    if (developerAccessToken) {
        const url = `${endpoint}intents/${id}`
        const method = 'get'
        const params = { v: version }
        const headers = {
            Authorization: `Bearer ${developerAccessToken}`,
            'Content-Type': 'application/json'
        }

        const config = { url, method, headers, params }

        return axios(config).then(response => {
            console.log('GET INTENT', JSON.stringify(response.data))
            return response.data
        })
    } else {
        throw new Error(
            'No messenger config: dialogflow.developer.access.token'
        )
    }
}

export const updateIntent = (oldIntent, attribute) => {
    const developerAccessToken = process.env.DIALOGFLOW_DEV_ACCESS_TOKEN
    if (developerAccessToken) {
        let newIntent = oldIntent
        let parameters = newIntent.responses[0].parameters
        let userSays = newIntent.userSays

        parameters.push({
            required: false,
            dataType: `@${attribute.code}`,
            name: toArray(attribute.values).length
                ? toArray(attribute.values)[0].name
                : 'attribute',
            value: `$${attribute.code}`,
            isList: false
        })

        newIntent.responses[0].parameters = parameters

        const dataIndex = {
            text: toArray(attribute.values).length
                ? toArray(attribute.values)[0].name
                : 'attribute',
            alias: attribute.code,
            meta: `@${attribute.code}`,
            userDefined: false
        }

        let data = userSays[userSays.length - 1]['data']
        data.splice(data.length - 2, 0, dataIndex)
        data.splice(data.length - 1, 0, { text: ' ', userDefined: false })
        userSays[0].data.push(data)
        newIntent.userSays = userSays

        const url = `${endpoint}intents/${newIntent.id}`
        const method = 'put'
        const params = { v: version }
        const headers = {
            Authorization: `Bearer ${developerAccessToken}`,
            'Content-Type': 'application/json'
        }

        console.log('UPDATE INTENT', JSON.stringify(newIntent))

        const config = { url, method, headers, params, data: newIntent }

        return axios(config)
    } else {
        throw new Error(
            'No messenger config: dialogflow.developer.access.token'
        )
    }
}

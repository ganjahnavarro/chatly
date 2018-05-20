import _ from 'lodash'
import api from '../../api'

const { getProductTypes, getProductTypeAttributes, getSessionDetails,
    updateSessionDetails, addCartItem } = api

export default (args, sendResponse) => {
    const { senderId, session } = args

    if (senderId) {
        getSessionDetails(senderId).then(sessionData => {
            let parameters = getParameters(sessionData, args)

            const productType = parameters['product-type']
            const quantity = parameters.quantity

            getProductTypes().then(productTypes => {
                const selectedProductType = productTypes.find(item => item.name.toLowerCase() === productType.toLowerCase())
                console.log('Product Type:', JSON.stringify(selectedProductType))

                getProductTypeAttributes(selectedProductType).then(attributes => {
                    const selectedAttributeValues = []
                    const missingAttributes = []

                    if (attributes && attributes.length) {
                        attributes.forEach(attribute => {
                            if (!parameters[attribute.code]) {
                                let hasSelectedAttrib = false
                                attribute.values = attribute.values && attribute.values.length ? attribute.values : []

                                const parametersAttribs = _.omit(parameters, ['product-type', 'quantity'])
                                _.forOwn(parametersAttribs, (value, key) => {
                                    attribute.values.forEach(attribValue => {
                                        if (value.toLowerCase() === attribValue.name.toLowerCase()) {
                                            hasSelectedAttrib = true
                                            selectedAttributeValues.push(attribValue)
                                            parameters[attribute.code] = attribValue.name
                                        }
                                    })
                                })

                                if (!hasSelectedAttrib) {
                                    missingAttributes.push(attribute)
                                }
                            } else {
                                const paramValue = parameters[attribute.code].toLowerCase()
                                const selectedAttributeValue = attribute.values.find(value => value.name.toLowerCase() === paramValue)
                                selectedAttributeValues.push(selectedAttributeValue)
                            }
                        })

                        if (missingAttributes.length) {
                            askForMissingAttribute(missingAttributes, parameters, args, sendResponse)
                            return
                        }
                    }

                    const selectedProduct = getSelectedProduct(selectedProductType, selectedAttributeValues)
                    addToCart(args, selectedProduct, selectedProductType, quantity)

                    const description = selectedProduct ? `${selectedProduct.description} ` : ''
                    const message = `OK. ${quantity} ${description}${selectedProductType.name} added to your cart. Anything else?`

                    const outputContexts = [
                        { name: `${session}/contexts/product-added`, lifespanCount: 1 }
                    ]
                    const responseToCustomer = {
                        fulfillmentText: message,
                        outputContexts
                    }
                    sendResponse({ responseToCustomer, ...args })
                })
            })
        })
    }
}

const getParameters = (sessionData, args) => {
    const sessionParameters = sessionData ? sessionData.parameters : undefined
    const parameters = Object.assign({}, sessionParameters, args.parameters)
    parameters.quantity = parameters.quantity || 1

    const askedAttribute = getAskedAttribute(args)

    if (askedAttribute && args.parameters['selected-option']) {
        parameters[askedAttribute] = parameters['selected-option']
        delete parameters['selected-option']
    }
    return parameters
}

const getAskedAttribute = ({ session, contexts }) => {
    let context = null
    if (contexts && contexts.length) {
        context = contexts.find(item => item.name === `${session}/contexts/product-incomplete`)
    }

    return context ? context.parameters['asked-attribute'] : undefined
}

const getSelectedProduct = (selectedProductType, selectedAttributeValues) => {
    let selectedProduct

    if (selectedProductType.products) {
        const products = selectedProductType.products
        const selectedAttributeValueIds = selectedAttributeValues.map(value => value._id).sort()

        selectedProduct = products.find(product => {
            return _.isEqual(product.attribute_values.sort(), selectedAttributeValueIds)
        })
    }
    console.log('Selected Product:', JSON.stringify(selectedProduct))
    return selectedProduct
}

const addToCart = (args, selectedProduct, selectedProductType, quantity) => {
    const { senderId } = args

    const cartItem = {
        product_type_id: selectedProductType._id,
        quantity
    }

    if (selectedProduct) {
        cartItem.product_id = selectedProduct._id
    }

    addCartItem(senderId, cartItem)
    updateSessionDetails(senderId, { parameters: null })
}

const askForMissingAttribute = (missingAttributes, parameters, args, sendResponse) => {
    const { session, senderId } = args

    const missingAttribute = missingAttributes[0]
    const values = missingAttribute.values

    const quickReplies = values.map(value => {
        return {
            content_type: 'text',
            title: value.name,
            payload: `Options: ${value.name}`
        }
    })

    const text = `What ${missingAttribute.name} do you want?`
    const payload = {
        facebook: {
            text,
            quick_replies: quickReplies
        }
    }

    const outputContexts = [
        {
            name: `${session}/contexts/product-incomplete`,
            lifespanCount: 1,
            parameters: {
                'asked-attribute': missingAttribute.code,
                ...parameters
            }
        }
    ]

    const responseToCustomer = {
        fulfillmentText: text,
        outputContexts,
        payload
    }

    updateSessionDetails(senderId, { parameters })
    sendResponse({
        responseToCustomer,
        ...args
    })
}

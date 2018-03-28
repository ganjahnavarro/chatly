import _ from 'lodash'
import { getProductTypes, getProductTypeAttributes, database } from '../../api/firebase'
import { toArray } from '../../utils'

export default (args, sendResponse) => {
    const { senderId } = args

    if (senderId) {
        const sessionRef = database.ref(`sessions/${senderId}`)

        sessionRef.once('value', snapshot => {
            const parameters = getParameters(snapshot.val(), args)

            const productType = parameters['product-type']
            const quantity = parameters.quantity

            getProductTypes().then(productTypes => {
                const selectedProductType = productTypes.find(item => item.name.toLowerCase() === productType.toLowerCase())
                console.log('Product Type:', JSON.stringify(selectedProductType))

                getProductTypeAttributes(selectedProductType).then(attributes => {
                    console.log('Attributes', JSON.stringify(attributes))

                    const selectedAttributeValues = []
                    const missingAttributes = []

                    if (attributes && attributes.length) {
                        attributes.forEach(attribute => {
                            if (!parameters[attribute.code]) {
                                missingAttributes.push(attribute)
                            } else {
                                const paramValue = parameters[attribute.code].toLowerCase()
                                const selectedAttributeValue = toArray(attribute.values).find(value => value.name.toLowerCase() === paramValue)

                                console.log('selectedAttributeValue', JSON.stringify(selectedAttributeValue))
                                selectedAttributeValues.push(selectedAttributeValue)
                            }
                        })

                        console.log('Missing Attributes', JSON.stringify(missingAttributes))
                        console.log('Selected Attributes Values', JSON.stringify(selectedAttributeValues))

                        if (missingAttributes.length) {
                            askForMissingAttribute(sessionRef, missingAttributes, parameters, args, sendResponse)
                            return
                        }
                    }

                    const selectedProduct = getSelectedProduct(selectedProductType, selectedAttributeValues)
                    addToCart(sessionRef, selectedProduct, selectedProductType, quantity)

                    const description = selectedProduct ? `${selectedProduct.description} ` : ''
                    const message = `OK. ${quantity} ${description}${selectedProductType.name} added to your cart. Anything else?`
                    sendResponse({ responseToUser: message, ...args })
                })
            })
        })
    }
}

const getParameters = (sessionData, args) => {
    const sessionParameters = sessionData ? sessionData.parameters : undefined
    const parameters = Object.assign({}, sessionParameters, args.parameters)
    parameters.quantity = parameters.quantity || 1

    if (sessionData && sessionData.asked_attribute && args.parameters['selected-option']) {
        parameters[sessionData.asked_attribute] = parameters['selected-option']
        delete parameters['selected-option']
    }
    console.log('Parameters: ', JSON.stringify(parameters))
    return parameters
}

const getSelectedProduct = (selectedProductType, selectedAttributeValues) => {
    let selectedProduct

    if (selectedProductType.products) {
        const products = toArray(selectedProductType.products)
        console.log('Products', JSON.stringify(products))

        const selectedAttributeValueIds = selectedAttributeValues.map(value => value.id).sort()
        console.log('Selected attribute value IDs:', selectedAttributeValueIds)

        selectedProduct = products.find(product => {
            const productAttributeValues = _.values(product.attribute_values)
                .map(item => item.attribute_value_id)
            console.log('Product Attribute value IDs:', productAttributeValues)
            return _.isEqual(productAttributeValues.sort(), selectedAttributeValueIds)
        })
    }

    console.log('Selected Product:', JSON.stringify(selectedProduct))
    return selectedProduct
}

const addToCart = (sessionRef, selectedProduct, selectedProductType, quantity) => {
    const cartItem = {
        product_type_id: selectedProductType.id,
        quantity
    }

    if (selectedProduct) {
        cartItem.product_id = selectedProduct.id
    }
    sessionRef.child('cart').push(cartItem)
    sessionRef.child('parameters').remove()
}

const askForMissingAttribute = (sessionRef, missingAttributes, parameters, args, sendResponse) => {
    const { session } = args

    const missingAttribute = missingAttributes[0]
    const values = toArray(missingAttribute.values)

    const quickReplies = values.map(value => {
        return {
            content_type: 'text',
            title: value.name,
            payload: `Option select: ${value.name}`
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
            parameters: parameters
        }
    ]

    const responseToUser = {
        fulfillmentText: text,
        outputContexts,
        payload
    }

    sessionRef.update({
        parameters,
        asked_attribute: missingAttribute.code
    })

    sendResponse({
        responseToUser,
        ...args
    })
}

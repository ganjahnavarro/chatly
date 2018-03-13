import { getProduct, database } from '../../api/firebase'
import _ from 'lodash'
import Promise from 'promise'

const getItem = (senderId, itemId) => {
    const sessionRef = database.ref(
        `sessions/${senderId}/cart/${itemId}`
    )

    return new Promise((resolve, reject) => {
        sessionRef.once('value', snapshot => {
            const { product } = snapshot.val()
            getProduct(product).then(res => {
                resolve({
                    ...snapshot.val(),
                    product: res
                })
            })
        })
    })
}

const onShowCart = (args, sendResponse) => {
    const { payloadData } = args
    if (payloadData && payloadData.sender && payloadData.sender.id) {
        const senderId = payloadData.sender.id
        const cartRef = database.ref(`sessions/${senderId}/cart`)

        cartRef.once('value', snapshot => {
            let promises = []

            const keys = _.keys(snapshot.val())
            keys.forEach(key => promises.push(getItem(senderId, key)))

            Promise.all(promises).then(res => {
                let elements = []
                res.forEach(item => {
                    elements.push({
                        title: item.product.name,
                        image_url: item.product.imageURL,
                        subtitle: item.product.description,
                        buttons: [
                            {
                                type: 'postback',
                                payload: item.product.name,
                                title: `Add More (qty: ${item.quantity})`
                            }
                        ]
                    })
                })

                const payload = {
                    facebook: {
                        attachment: {
                            type: 'template',
                            payload: {
                                template_type: 'generic',
                                elements: elements
                            }
                        }
                    }
                }

                const responseToUser = { payload }
                sendResponse({ responseToUser, ...args })
            })
        })
    } else {
        console.error('Invalid state. Payload Data: ' + JSON.stringify(payloadData))
    }
}

export default onShowCart

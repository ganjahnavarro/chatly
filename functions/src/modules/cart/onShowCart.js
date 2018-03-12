import { database } from '../../api/firebase'
import _ from 'lodash'
import Promise from 'promise'

const getCategories = categoryKey => {
    const categoryRef = database.ref(`categories/${categoryKey}`)
    return new Promise((resolve, reject) => {
        categoryRef.once('value', snapshot => {
            resolve(snapshot.val())
        })
    })
}

const getProduct = productKey => {
    const productsRef = database.ref(`products/${productKey}`)
    return new Promise((resolve, reject) => {
        productsRef.once('value', snapshot => {
            const { categoryId } = snapshot.val()
            getCategories(categoryId).then(res => {
                resolve({
                    ...snapshot.val(),
                    category: res
                })
            })
        })
    })
}

const getItems = itemId => {
    const sessionRef = database.ref(
        `sessions/${1615712965183322}/cart/${itemId}`
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
    const sessionRef = database.ref(`sessions/${1615712965183322}/cart`)
    sessionRef.once('value', snapshot => {
        let promises = []

        const keys = _.keys(snapshot.val())

        keys.forEach(item => promises.push(getItems(item)))

        Promise.all(promises).then(res => {
            let elements = []
            res.forEach(item => {
                elements.push({
                    title: item.product.name,
                    image_url: item.product.image,
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
}

export default onShowCart

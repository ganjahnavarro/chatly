RESTORE .JSON TO A COLLECTION:

    mongoimport --db chatly --collection attributes --file chatly-bot-attributes-export.json.json

RUN CODE:

    import { MongoClient } from 'mongodb'

    const uri = 'mongodb://localhost:27017/chatly'

    MongoClient.connect(uri, (err, rootDatabase) => {
        console.log('Connected..')

        if (err) {
            throw err
        }

        const database = rootDatabase.db('chatly')
        const mongoCollection = database.collection('product_types')
        const fbaseCollection = database.collection('fproduct_types')

        fbaseCollection.findOne().then(result => {
            if (err) {
                throw err
            }

            const items = Object.values(result)

            items.forEach((item, index) => {
                const { _id, ...rest } = item

                if (rest.category_id) {
                    const createAttributePromise = (value) => {
                        return new Promise((resolve, reject) => {
                            database
                                .collection('attributes')
                                .findOne({ old_id: value.attribute_id })
                                .then(attr => resolve(attr))
                        })
                    }

                    const createAttributeValuePromise = (attributeValue) => {
                        return new Promise((resolve, reject) => {
                            database.collection('attributes')
                                .findOne({ 'values.old_id': attributeValue.attribute_value_id })
                                .then(foundAttribute => {
                                    resolve(foundAttribute.values.find(value => value.old_id === attributeValue.attribute_value_id))
                                })
                        })
                    }

                    const createProductPromise = (product) => {
                        return new Promise((resolve, reject) => {
                            const promises = Object.values(product.attribute_values).map(item => createAttributeValuePromise(item))

                            Promise.all(promises).then(avs => {
                                resolve({
                                    ...product,
                                    attribute_values: avs.map(attrValue => attrValue._id)
                                })
                            })
                        })
                    }

                    const attributesPromise = new Promise((resolve, reject) => {
                        if (rest.attributes) {
                            const promises = Object.values(rest.attributes).map(value => createAttributePromise(value))
                            Promise.all(promises).then(attrs => resolve(attrs))
                        } else {
                            resolve([])
                        }
                    })

                    const productsPromise = new Promise((resolve, reject) => {
                        if (rest.products) {
                            const promises = Object.values(rest.products).map(product => createProductPromise(product))
                            Promise.all(promises).then(products => resolve(products))
                        } else {
                            resolve([])
                        }
                    })

                    const categoryPromise = database.collection('categories').findOne({ old_id: rest.category_id })

                    Promise.all([categoryPromise, attributesPromise, productsPromise]).then(productTypeData => {
                        const category = productTypeData[0]
                        const attributes = productTypeData[1]
                        const products = productTypeData[2]

                        rest.category_id = category._id
                        rest.attributes = attributes.map(attr => attr._id)
                        rest.products = products
                        mongoCollection.insert(rest)

                        console.log('Done..')
                    })
                }
            })
        })
    })

SAMPLE DATA:

    "[
        {
            "_id": "5acbb68f8dd4d27ce8a89740",
            "code": "attr-dressing",
            "name": "Dressing",
            "values": [
                {
                    "id": "5acbb68f8dd4d27ce8a8973e",
                    "name": "Ranch"
                },
                {
                    "id": "5acbb68f8dd4d27ce8a8973f",
                    "name": "Thousand Island"
                }
            ]
        }
    ]"

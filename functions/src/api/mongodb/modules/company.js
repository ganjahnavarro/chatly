import Client from '../database'

export const getCompany = () => {
    return new Promise((resolve, reject) => {
        Client.getCollection('companies').findOne({}, (err, data) => {
            if (err) {
                throw err
            }
            resolve(data)
        })
    })
}

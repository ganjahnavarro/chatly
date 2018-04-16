import Client from '../database'

export const getBranches = () => {
    return new Promise((resolve, reject) => {
        Client.getCollection('branches').find().toArray((err, data) => {
            if (err) {
                throw err
            }
            resolve(data)
        })
    })
}

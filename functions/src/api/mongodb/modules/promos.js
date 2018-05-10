import moment from 'moment'
import { ObjectId } from 'mongodb'
import Client from '../database'

export const getPromoByCode = (promoCode, timestamp) => {
    return new Promise((resolve, reject) => {
        Client
            .getCollection('promos')
            .find({ code: promoCode, active: true })
            .toArray((err, data) => {
                if (err) {
                    throw err
                }
                const selectedPromo = data.find(promo => {
                    const requestDate = moment(timestamp)
                    const startDate = moment(promo.start_date, 'YYYY-MM-DD HH:mm')
                    const endDate = moment(promo.end_date, 'YYYY-MM-DD HH:mm')
                    return requestDate.isBetween(startDate, endDate)
                })
                resolve(selectedPromo)
            })
    })
}

export const getPromos = () => {
    return new Promise((resolve, reject) => {
        Client
            .getCollection('promos')
            .find({ deleted: false })
            .toArray((err, data) => {
                if (err) {
                    throw err
                }
                resolve(data)
            })
    })
}

export const getPromo = id => {
    return new Promise((resolve, reject) => {
        Client.getCollection('promos').findOne(ObjectId(id), (err, data) => {
            if (err) {
                throw err
            }
            resolve(data)
        })
    })
}

export const addPromo = data => {
    Client.getCollection('promos').insert({ ...data, deleted: false })
}

export const updatePromo = (id, data) => {
    Client.getCollection('promos').update(
        { _id: ObjectId(id) },
        { $set: data }
    )
}

export const deletePromo = id => {
    updatePromo(id, { deleted: true })
}

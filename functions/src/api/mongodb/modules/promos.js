import moment from 'moment'
import Client from '../database'

export const getPromoCode = (promoCode, timestamp) => {
    return new Promise((resolve, reject) => {
        Client
            .getCollection('categories')
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

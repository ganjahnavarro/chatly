/*
const addOrder = (senderId, order) => {
    const orderRef = database.ref(`orders/${senderId}`).push(order)
    return orderRef.key
}

const getUserOrders = (senderId) => {
    return new Promise((resolve, reject) => {
        database.ref(`orders/${senderId}`).once('value', snapshot => {
            if (snapshot && snapshot.val()) {
                resolve(toArray(snapshot.val()))
            } else {
                resolve([])
            }
        })
    })
}

const getUserOrderById = (senderId, orderId) => {
    return new Promise((resolve, reject) => {
        database.ref(`orders/${senderId}/${orderKey}`)
            .once('value', snapshot => resolve(snapshot.val()))
    })
}

const getUserOrderByDocumentNo = (senderId, documentNo) => {
    return new Promise((resolve, reject) => {
        database.ref(`orders/${senderId}`).once('value', snapshot => {
            if (snapshot && snapshot.val()) {
                const orders = toArray(snapshot.val())
                const order = orders.find(order => String(order.document_no) === documentNo)
                resolve(order)
            }
        })
    })
}

const updateOrderDetails = (senderId, id, data) => {
    database.ref(`orders/${senderId}/${id}`).update(data)
}

const updateOrderStatusHistory = (senderId, id, data) => {
    database.ref(`orders/${senderId}/${id}/status_history`).push(data)
}
*/

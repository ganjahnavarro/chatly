import api from '../../api'

const { getBranches } = api

export default (args, sendResponse) => {
    getBranches().then(branches => {
        const quickReplies = []
        branches.forEach(branch => {
            quickReplies.push({
                content_type: 'text',
                title: branch.name,
                payload: `Change branch to ${branch.name}`
            })
        })

        const text = 'In what branch you want this to pick up?'
        const payload = {
            facebook: {
                text,
                quick_replies: quickReplies
            }
        }

        const responseToCustomer = { fulfillmentText: text, payload }

        sendResponse({
            responseToCustomer,
            ...args
        })
    })
}

import { database } from '../../api/firebase'

export default (args, sendResponse) => {
    database.ref('branches').once('value').then(snapshot => {
        const branchesSnapshot = snapshot.val()
        const branches = Object.keys(branchesSnapshot).map(key => branchesSnapshot[key])

        const quickReplies = []
        branches.forEach(branch => {
            quickReplies.push({
                content_type: 'text',
                title: branch.name,
                payload: branch.name
            })
        })

        const text = 'In what branch you want this to pick up?'
        const payload = {
            facebook: {
                text,
                quick_replies: quickReplies
            }
        }

        const responseToUser = { fulfillmentText: text, payload }

        sendResponse({
            responseToUser,
            ...args
        })
    })
}

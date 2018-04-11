import onAskBranch from './onAskBranch'
import onOrderContinue from '../order/onOrderContinue'
import api from '../../api'

const { getBranches, database } = api

export default (args, sendResponse) => {
    const { parameters, senderId } = args
    const { branch } = parameters

    if (senderId) {
        if (!branch) {
            onAskBranch(args, sendResponse)
            return
        }

        getBranches().then(branches => {
            const selectedBranch = branches.find(item => item.name.toLowerCase() === branch.toLowerCase())
            if (selectedBranch) {
                database.ref(`users/${senderId}`).update({ branch: selectedBranch })
            }
        })
    }
    onOrderContinue(args, sendResponse)
}

import onAskBranch from './onAskBranch'
import onOrderContinue from '../order/onOrderContinue'
import api from '../../api'

const { getBranches, updateUserDetails } = api

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
                updateUserDetails(senderId, { branch: selectedBranch })
            }
        })
    }
    onOrderContinue(args, sendResponse)
}

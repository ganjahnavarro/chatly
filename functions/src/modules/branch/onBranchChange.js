import { getBranches, database } from '../../api/firebase'
import onAskContactNumber from '../user/onAskContactNumber'

export default (args, sendResponse) => {
    const { parameters, senderId } = args
    const { branch } = parameters

    if (senderId && branch) {
        getBranches().then(branches => {
            const selectedBranch = branches.find(item => item.name.toLowerCase() === branch.toLowerCase())
            if (selectedBranch) {
                database.ref(`sessions/${senderId}`).update({ branch: selectedBranch })
            }
        })
    }
    onAskContactNumber(args, sendResponse)
}

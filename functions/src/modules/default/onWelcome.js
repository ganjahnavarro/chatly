import { getUserDetails } from '../../api/messenger'

export default (args, sendResponse) => {
    const { payloadData } = args

    if (payloadData && payloadData.sender && payloadData.sender.id) {
        getUserDetails(payloadData.sender.id)
    }

    sendResponse({ responseToUser: 'Welcome to chatly', ...args })
}

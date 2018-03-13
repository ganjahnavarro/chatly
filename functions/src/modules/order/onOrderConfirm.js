import onSendReceipt from './onSendReceipt'

export default (args, sendResponse) => {
    // TODO save order, clear cart, and email?
    onSendReceipt(args, sendResponse)
}

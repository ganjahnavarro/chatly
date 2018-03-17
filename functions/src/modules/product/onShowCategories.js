import { getCategories } from '../../api/firebase'

export default (args, sendResponse) => {
    getCategories().then(categories => {
        console.log('Categories: ', JSON.stringify(categories))
        sendResponse({ responseToUser: `Categories count:  ${categories.length}`, ...args })
    })
}

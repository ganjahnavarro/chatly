import { getCategories } from '../../api/firebase'

export default (args, sendResponse) => {
    getCategories().then(items => {
        console.log('Categories: ', JSON.stringify(items))
        items.sort((a, b) => a.index > b.index)

        const elements = []

        items.forEach(item => {
            elements.push({
                title: item.name,
                subtitle: item.description || item.name,
                image_url: item.image_url,
                buttons: [
                    {
                        type: 'postback',
                        payload: `Show ${item.name}`,
                        title: 'View Items'
                    }
                ]
            })
        })

        const payload = {
            facebook: {
                attachment: {
                    type: 'template',
                    payload: {
                        template_type: 'generic',
                        elements: elements
                    }
                }
            }
        }

        const responseToUser = { payload }
        sendResponse({ responseToUser, ...args })
    })
}

import { getUserDetails } from '../../api/messenger'
import { database } from '../../api/firebase'

export default (args, sendResponse) => {
    const { senderId } = args

    if (senderId) {
        getUserDetails(senderId)
        database.ref(`sessions/${senderId}`).remove()
    }

    const elements = [
        {
            title: 'Welcome to Shakey\'s Pizza Parlor',
            image_url: 'http://images.gmanews.tv/webpics/2016/11/640_Shakeys_2016_11_30_12_23_07.jpg',
            subtitle: 'Shakey’s has been creating over 40 years of great times and great memories in the Philippines.',
            buttons: [
                {
                    type: 'postback',
                    payload: 'Show menu',
                    title: 'Menu'
                },
                {
                    type: 'postback',
                    payload: 'How to use',
                    title: 'How to use'
                }
            ]
        },
        {
            title: 'Shakey\'s Pizza Parlor',
            image_url: 'https://i.imgur.com/qBThzIi.png',
            subtitle: 'Having started its first store in Metro Manila way back in 1975, Shakey’s now operates nationwide with a strong store count of 189 stores.',
            buttons: [
                {
                    type: 'postback',
                    payload: 'About Us',
                    title: 'About Us'
                },
                {
                    type: 'postback',
                    payload: 'Stores',
                    title: 'View Stores'
                }
            ]
        }
    ]

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
}

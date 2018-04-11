import { getUserDetails } from '../../api/messenger'
import api from '../../api'

const { updateSessionDetails } = api

export default (args, sendResponse) => {
    const { senderId } = args

    if (senderId) {
        getUserDetails(senderId)
        updateSessionDetails(senderId, null)
    }

    const elements = [
        {
            title: 'Welcome to Shakey\'s Pizza Parlor',
            image_url: 'https://i.imgur.com/r2fUAc8.jpg',
            subtitle: 'Shakey’s has been creating over 40 years of great times and great memories in the Philippines.',
            buttons: [
                {
                    type: 'postback',
                    payload: 'Show menu',
                    title: 'Menu'
                },
                {
                    type: 'postback',
                    payload: 'About Us',
                    title: 'About Us'
                }
            ]
        },
        {
            title: 'Shakey\'s Pizza Parlor',
            image_url: 'https://i.imgur.com/qBThzIi.png',
            subtitle: 'Having started its first store in Metro Manila way back in 1975, Shakey’s now operates nationwide with a strong store count of 189 stores.',
            buttons: [
                {
                    type: 'web_url',
                    url: 'http://shakeyspizza.ph/store-finder.asp',
                    webview_height_ratio: 'full',
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

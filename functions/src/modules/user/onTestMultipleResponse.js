export default (args, sendResponse) => {
    const createTextResponse = (message) => {
        return {
            text: {
                text: [message]
            }
        }
    }

    /*
    const createQuickRepliesResponse = () => {
        return [{
            quickReplies: {
                title: 'vbr_title',
                quickReplies: [
                    'vbr_btn_1',
                    'vbr_btn_2',
                    'vbr_btn_3'
                ]
            },
            platform: 'VIBER'
        }, {
            quickReplies: {
                title: 'fb_title',
                quickReplies: [
                    'fb_btn_1',
                    'fb_btn_2'
                ]
            },
            platform: 'FACEBOOK'
        }]
    }
    */

    const responseToUser = {
        fulfillmentMessages: [
            createTextResponse('Hey!'),
            createTextResponse('Ho!'),
            createTextResponse('Let\'s go!'),
            createTextResponse('From webhook!')
        ]
    }

    sendResponse({ responseToUser, ...args })
}

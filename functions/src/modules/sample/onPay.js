export default (args, sendResponse) => {
    const payload = {
        facebook: {
            attachment: {
                type: 'template',
                payload: {
                    template_type: 'button',
                    text: 'Please click the link to pay for you order (P20.00).',
                    buttons: [
                        {
                            type: 'web_url',
                            url: 'https://www.paypal.me/ganjahnavarro/20',
                            webview_height_ratio: 'tall',
                            title: 'Pay'
                        }
                    ]
                }
            }
        }
    }

    const responseToUser = { payload }
    sendResponse({ responseToUser, ...args })
}

// import admin from '../../api/cart'

export default (args, sendResponse) => {
    // const sessionRef = admin.database().ref(`session/123eafkqhew`)

    // let value = {}

    // sessionRef.once("value", snapshot => {
    // console.log(snapshot.val());
    // });

    const fulfillmentText = 'Sample Quick Reply'

    const payload = {
        facebook: {
            attachment: {
                type: 'template',
                payload: {
                    template_type: 'generic',
                    elements: [
                        {
                            title: 'Extravaganzza',
                            image_url: 'http://www.paparonspizza.com/gfx/products/1257157444.jpg',
                            subtitle: 'Think and Crispy',
                            buttons: [
                                {
                                    type: 'postback',
                                    payload: 'Extravaganzza',
                                    title: 'Buy'
                                }
                            ]
                        },
                        {
                            title: 'Kalamata',
                            image_url: 'http://www.paparonspizza.com/gfx/products/1257157444.jpg',
                            subtitle: 'Spicy',
                            buttons: [
                                {
                                    type: 'postback',
                                    payload: 'Extravaganzza',
                                    title: 'Buy'
                                }
                            ]
                        }
                    ]
                }
            }
        }
    }

    const responseToUser = { fulfillmentText, payload }

    sendResponse({ responseToUser, ...args })
}

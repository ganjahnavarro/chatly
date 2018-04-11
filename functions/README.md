npm install

firebase login

# Firebase
Set environment configuration (https://firebase.google.com/docs/functions/config-env)

firebase functions:config:set messenger.page.access.token="<TOKEN>"
firebase functions:config:set maps.api.key="<API_KEY>"
firebase functions:config:set dialogflow.developer.access.token="<API_KEY>"

firebase deploy --only functions:dialogflowFulfillment

# MongoDB
localhost:
    mongo --host localhost:27017

mongodb atlas:
    mongoshell "mongodb+srv://cluster0-kyhls.mongodb.net/test" --username un --password pw
    (connectdb-chatly on local dev environment)

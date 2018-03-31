npm install

firebase login

# Set environment configuration (https://firebase.google.com/docs/functions/config-env)
firebase functions:config:set messenger.page.access.token="<TOKEN>"
firebase functions:config:set maps.api.key="<API_KEY>"
firebase functions:config:set dialogflow.developer.access.token="<API_KEY>"

firebase deploy --only functions:dialogflowFulfillment

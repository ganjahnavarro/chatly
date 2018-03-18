import firebase from "firebase";

const config = {
	apiKey: "AIzaSyCmoPYR2uN2uOWoYPyAWSmbSq_FkK-K0X4",
	authDomain: "chatly-test-6f985.firebaseapp.com",
	databaseURL: "https://chatly-test-6f985.firebaseio.com",
	storageBucket: "chatly-test-6f985.appspot.com"
};

firebase.initializeApp(config);

const database = firebase.database();

export default database;

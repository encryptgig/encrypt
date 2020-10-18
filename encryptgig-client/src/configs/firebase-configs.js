import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyBRV50Jqwzr5ptao0MO6ZG7m1YrsL50QwU",
  authDomain: "encryptgig-test.firebaseapp.com",
  databaseURL: "https://encryptgig-test.firebaseio.com",
  projectId: "encryptgig-test",
  storageBucket: "encryptgig-test.appspot.com",
  messagingSenderId: "1069934900773",
  appId: "1:1069934900773:web:2a89079dc4421342ed71cc",
  measurementId: "G-HS7YSZRMZH",
};

const fire = firebase.initializeApp(firebaseConfig);

export default fire;

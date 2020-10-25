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

const firebaseConfigProd = {
  apiKey: "AIzaSyD6FY9d1lKs7cZ_6Fu2PV7iiNOsZMnJ7ns",
  authDomain: "encryptgig-9925d.firebaseapp.com",
  databaseURL: "https://encryptgig-9925d.firebaseio.com",
  projectId: "encryptgig-9925d",
  storageBucket: "encryptgig-9925d.appspot.com",
  messagingSenderId: "159482259367",
  appId: "1:159482259367:web:5db6dddf086e20b6df7882",
  measurementId: "G-RXT3YPG4HR",
};

const fire = firebase.initializeApp(firebaseConfigProd);

export default fire;

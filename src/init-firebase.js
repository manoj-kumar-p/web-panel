import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyD4TwpPmwqzFhGRXx3oir4LI2F09r12kPo",
  authDomain: "padangel.firebaseapp.com",
  databaseURL: "https://padangel.firebaseio.com",
  projectId: "padangel",
  storageBucket: "padangel.appspot.com",
  messagingSenderId: "836059370402",
  appId: "1:836059370402:web:ec2e6f26b2892c0cc098fb",
  measurementId: "G-CVV97Y1781",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// firebase.analytics();

export default firebase;

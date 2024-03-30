// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD1msHRd8PSIUkceOrwa6hy82qO2ozuPQs",
  authDomain: "pletest-201eb.firebaseapp.com",
  projectId: "pletest-201eb",
  storageBucket: "pletest-201eb.appspot.com",
  messagingSenderId: "725910970549",
  appId: "1:725910970549:web:a518b4c87d4167e93d9efc",
  measurementId: "G-FR9BB9QC0Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();

export  {auth, app, analytics}
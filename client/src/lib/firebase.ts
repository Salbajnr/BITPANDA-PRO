// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBu0Njkv6O22BfLoqT1meiWhYUGjoedQT8",
  authDomain: "bitpandapro-a33d3.firebaseapp.com",
  projectId: "bitpandapro-a33d3",
  storageBucket: "bitpandapro-a33d3.appspot.com",
  messagingSenderId: "800797911995",
  appId: "1:800797911995:web:7a1181635130fdbd8bb29e",
  measurementId: "G-CCPC7V9JWJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

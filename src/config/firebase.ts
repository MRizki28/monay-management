// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAZ111TiLaeOlKUhgPT5J9_rkCyFrbd5WI",
    authDomain: "tabungan-nikah.firebaseapp.com",
    databaseURL: "https://tabungan-nikah-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "tabungan-nikah",
    storageBucket: "tabungan-nikah.firebasestorage.app",
    messagingSenderId: "344974375328",
    appId: "1:344974375328:web:0cf90242043c0593c1ccc5",
    measurementId: "G-0P28E4R49K"
};

// Initialize Firebase
const database = getDatabase(initializeApp(firebaseConfig));

export default database;
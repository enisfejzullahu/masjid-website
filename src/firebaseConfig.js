// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDatabase, ref, get } from "firebase/database"; // Use Realtime Database methods

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCLIUWCN7YYLQhQBtc4VFXtCbMABP0BZj0",
  authDomain: "xhamia-ime-8e033.firebaseapp.com",
  databaseURL:
    "https://xhamia-ime-8e033-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "xhamia-ime-8e033",
  storageBucket: "xhamia-ime-8e033.appspot.com",
  messagingSenderId: "782339772420",
  appId: "1:782339772420:web:edc022b92f09a89c4c2551",
  measurementId: "G-QLV075M424",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const rtdb = getDatabase(app);
export const storage = getStorage(app);

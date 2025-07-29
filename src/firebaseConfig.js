// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";             // ✅ must be here
import { getFirestore } from "firebase/firestore";   // ✅ must be here
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCXP6L8hVyIWJs0ICpw8MwVx2hvUw3DFlU",
  authDomain: "engg-institutional-repo-9fffd.firebaseapp.com",
  projectId: "engg-institutional-repo-9fffd",
  storageBucket: "engg-institutional-repo-9fffd.firebasestorage.app",
  messagingSenderId: "363551526396",
  appId: "1:363551526396:web:e07f500ad4e2d064083679",
  measurementId: "G-Q6C0FXJKPF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// ✅ These must be exported
export const auth = getAuth(app);
export const db = getFirestore(app);


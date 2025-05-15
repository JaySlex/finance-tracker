// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBglllcowzeC2EBwqWhRmw_LIEwCR_S184",
  authDomain: "financetracker-a32a4.firebaseapp.com",
  projectId: "financetracker-a32a4",
  storageBucket: "financetracker-a32a4.firebasestorage.app",
  messagingSenderId: "923829556594",
  appId: "1:923829556594:web:92032fb0be613d7339b9eb",
  measurementId: "G-NSL2QB7ZLZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);


export { auth, db };
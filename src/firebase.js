import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
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

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
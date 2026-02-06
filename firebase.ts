
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCJRFptSHhvQ7D11kaTx4doCqz9Hw50S-E",
  authDomain: "funters-fund.firebaseapp.com",
  projectId: "funters-fund",
  storageBucket: "funters-fund.firebasestorage.app",
  messagingSenderId: "8227119915",
  appId: "1:8227119915:web:d5d33941e1761ed7655b6e"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

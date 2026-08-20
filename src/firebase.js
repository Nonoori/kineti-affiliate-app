import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {

  apiKey: "AIzaSyAwvv-17xBDBJvE90mhB8k0aE1-CJwE7-g",

  authDomain: "kineti-affiliate-986a0.firebaseapp.com",

  projectId: "kineti-affiliate-986a0",

  storageBucket: "kineti-affiliate-986a0.firebasestorage.app",

  messagingSenderId: "228334578676",

  appId: "1:228334578676:web:f679052bea1087ef2327a1",

  measurementId: "G-PM0BDLDZ5Q"

};



const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export { signInWithPopup, signOut };

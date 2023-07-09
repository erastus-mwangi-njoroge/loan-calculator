// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBVGyVv0Br1eX54pqqAmZP14Tk8xGLTXo8",
  authDomain: "loan-calculator-613d2.firebaseapp.com",
  projectId: "loan-calculator-613d2",
  storageBucket: "loan-calculator-613d2.appspot.com",
  messagingSenderId: "299839668080",
  appId: "1:299839668080:web:f377b33515ae8aa85e19b5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);

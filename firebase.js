// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDwqXN9GeOvjPDQmwpUBJyzigc8mCnS30c",
  authDomain: "inventory-pal-5f654.firebaseapp.com",
  projectId: "inventory-pal-5f654",
  storageBucket: "inventory-pal-5f654.appspot.com",
  messagingSenderId: "202091734477",
  appId: "1:202091734477:web:b08969fa88ab1eefd51084",
  measurementId: "G-DQWTQPHKB5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const firestore = getFirestore(app)

export { firestore }
export const auth = getAuth(app)
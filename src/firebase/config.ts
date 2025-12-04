import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDf8fxTw4Dtngk6lX7DXKjrEvyKsiSzIdQ",
  authDomain: "ustalmycosikapp.firebaseapp.com",
  projectId: "ustalmycosikapp",
  storageBucket: "ustalmycosikapp.firebasestorage.app",
  messagingSenderId: "639698570978",
  appId: "1:639698570978:web:3881ef56e9138f5a3ad8bb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

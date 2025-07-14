// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDwNXLj94zUpSHbwde97mdFndBG7aUkFck",
  authDomain: "flowchartapp-f019e.firebaseapp.com",
  projectId: "flowchartapp-f019e",
  storageBucket: "flowchartapp-f019e.appspot.com",
  messagingSenderId: "498429481863",
  appId: "1:498429481863:web:d4a35c155d8b2f375f3922"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);

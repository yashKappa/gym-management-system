import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCD6TvBc4QkGJfKq5xVq-yZKNAPW8wJpZI",
  authDomain: "gym-management-sys-4f7e8.firebaseapp.com",
  projectId: "gym-management-sys-4f7e8",
  storageBucket: "gym-management-sys-4f7e8.appspot.com",
  messagingSenderId: "290215404954",
  appId: "1:290215404954:web:be26c19d2be28ed6094623",
  measurementId: "G-KJ9B2X0TR9"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
export const storage = getStorage(app);

export { db, auth };

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAZCNRSPlDFTzK_HNBKxRYQkX7XJIzSSW4",
  authDomain: "mark-studio-4b30a.firebaseapp.com",
  projectId: "mark-studio-4b30a",
  storageBucket: "mark-studio-4b30a.firebasestorage.app",
  messagingSenderId: "717134874279",
  appId: "1:717134874279:web:e2d5ac9923c79ae21e3d82",
  measurementId: "G-NNNZWPJ6X1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;
const storage = getStorage(app);

export { db, analytics, storage };

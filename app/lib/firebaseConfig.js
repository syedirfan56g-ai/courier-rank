import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDUKtJDp44HEc3kXQqZ0iZ7NFsv8z_F2qo",
  authDomain: "courier-rank.firebaseapp.com",
  projectId: "courier-rank",
  storageBucket: "courier-rank.firebasestorage.app",
  messagingSenderId: "926334984531",
  appId: "1:926334984531:web:7d98269ee197ede32201a6",
  measurementId: "G-3RY2EKPXFP"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

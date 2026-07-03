import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBRBO1SmUjDVHB1F3ms7Ip8H0gZf_4XZJI",
  authDomain: "smartid-yourschool.firebaseapp.com",
  projectId: "smartid-yourschool",
  storageBucket: "smartid-yourschool.firebasestorage.app",
  messagingSenderId: "778564839210",
  appId: "1:778564839210:web:955488a9e6d67446f56053"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.warn('Firestore persistence failed: multiple tabs open');
  } else if (err.code === 'unimplemented') {
    console.warn('Firestore persistence not supported');
  }
});

export default app;

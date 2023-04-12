// Import the functions you need from the SDKs you need
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  collection,
  getFirestore,
  addDoc,
  setDoc,
  doc,
} from "firebase/firestore";
import { initializeApp } from "firebase/app";

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: "countries-lesson.firebaseapp.com",
  projectId: "countries-lesson",
  storageBucket: "countries-lesson.appspot.com",
  messagingSenderId: "979339373455",
  appId: "1:979339373455:web:5b40039f3538c8496e79fa",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

let userCredential = undefined;

const logInWithEmailAndPassword = async (email, password) => {
  try {
    userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential;
  } catch (err) {
    alert(err.message);
  }
};

const registerWithEmailAndPassword = async (name, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    // the response gives us an object "user" back
    const user = res.user;
    // This will become our fields in the database
    await addDoc(collection(db, "users"), {
      uid: user.uid,
      name,
      authProvider: "local",
      email,
    });
    await setDoc(doc(db, "favourites", user.uid), {
      faves: [],
      uid: user.uid,
    });
  } catch (err) {
    alert(err.message);
  }
};

const logOut = () => {
  signOut(auth);
};

export {
  auth,
  db,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  logOut,
  userCredential,
};

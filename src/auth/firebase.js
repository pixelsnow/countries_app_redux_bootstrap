// Import the functions you need from the SDKs you need
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { collection, getFirestore, addDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDhd7wUuQrbqz7mO06jBNziYXbH6KMO8mc",
  authDomain: "countries-lesson.firebaseapp.com",
  projectId: "countries-lesson",
  storageBucket: "countries-lesson.appspot.com",
  messagingSenderId: "979339373455",
  appId: "1:979339373455:web:5b40039f3538c8496e79fa",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
// This is using our app which has auth set up and creates a database
const db = getFirestore(app);

const logInWithEmailAndPassword = async (email, password) => {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    console.log(err);
    alert(err.message);
  }
};

const registerWithEmailAndPassword = async (name, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    // the response gives us an object "user" back
    const user = res.user;
    // const q = query(collection(db, "users"), where("uid", "==", user.id));
    // This will become our fields in the database
    await addDoc(collection(db, "users"), {
      uid: user.uid,
      name,
      authProvider: "local",
      email,
    });
  } catch (err) {
    console.log(err);
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
};

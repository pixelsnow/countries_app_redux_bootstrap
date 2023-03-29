import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate, Link } from "react-router-dom";

import { Button } from "react-bootstrap";

import { auth, logInWithEmailAndPassword } from "../auth/firebase";
import { useDispatch } from "react-redux";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../auth/firebase";
import { setFavourites } from "../features/countries/favouritesSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // This hook will store the user for us
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (loading) return;
    // If there is a user, we just navigate to home page
    if (user) navigate("/countries");
    if (error) console.log(error);
  }, [user, loading, error, navigate]);

  const logInHandler = async () => {
    const userCredential = await logInWithEmailAndPassword(email, password);
    const docRef = doc(db, "favourites", userCredential.user.uid);
    const docSnap = await getDoc(docRef);
    console.log("RES", docSnap.data());
    dispatch(setFavourites(docSnap.data().faves));
  };

  return (
    <div>
      <input
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <Button onClick={logInHandler}>Log in</Button>
      <div>
        Don't have an account? <Link to="/register">Sign up</Link> now.
      </div>
    </div>
  );
};

export default Login;

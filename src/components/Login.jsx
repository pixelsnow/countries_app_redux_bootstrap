import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate, Link } from "react-router-dom";

import { Button } from "react-bootstrap";

import { auth, logInWithEmailAndPassword } from "../auth/firebase";
import { useDispatch } from "react-redux";

import { fetchFavourites } from "../features/countries/favouritesSlice";
import { Form } from "react-bootstrap";

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

  const logInHandler = async (e) => {
    e.preventDefault();
    await logInWithEmailAndPassword(email, password);
    dispatch(fetchFavourites());
  };

  return (
    <div className="form-wrapper">
      <div className="form-container">
        <h1>Login</h1>
        <Form className="form">
          <Form.Control
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <Button type="submit" variant="custom" onClick={logInHandler}>
            Log in
          </Button>
        </Form>
        <div>
          Don't have an account? <Link to="/register">Sign up</Link> now.
        </div>
      </div>
    </div>
  );
};

export default Login;

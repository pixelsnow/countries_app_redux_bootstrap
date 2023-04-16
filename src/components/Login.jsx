// React
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

// Redux
import { useDispatch } from "react-redux";
import { fetchFavourites } from "../features/countries/favouritesSlice";

// Firebase
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, logInWithEmailAndPassword } from "../auth/firebase";

// Bootstrap
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (loading) return;
    // If there is a user, we just navigate to home page
    if (user) navigate("/countries");
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
        <div className="test-credentials">
          <p>Feel free to use the following credentials for testing:</p>
          <ul>
            <li>
              <span>Email:</span> tester@test.com
            </li>
            <li>
              <span>Password:</span> test1234
            </li>
          </ul>
        </div>
        <div>
          <p>
            Don't have an account? <Link to="/register">Sign up</Link> now.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

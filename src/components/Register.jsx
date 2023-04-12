// React
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

// Firebase
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, registerWithEmailAndPassword } from "../auth/firebase";

// Bootstrap
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  // This hook will store the user for us
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();

  const register = (e) => {
    e.preventDefault();
    if (!name) alert("Please enter name");
    registerWithEmailAndPassword(name, email, password);
  };

  useEffect(() => {
    if (loading) return;
    // If there is a user, we just navigate to home page
    if (user) navigate("/countries");
    if (error) alert(error.message);
  }, [user, loading, error, navigate]);

  return (
    <div className="form-wrapper">
      <div className="form-container">
        <h1>Register</h1>
        <Form className="form">
          <Form.Control
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full name"
          />
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
          <Button type="submit" variant="custom" onClick={register}>
            Register
          </Button>
        </Form>
        <div>
          Already have an account? <Link to="/login">Login</Link> now.
        </div>
      </div>
    </div>
  );
};

export default Register;

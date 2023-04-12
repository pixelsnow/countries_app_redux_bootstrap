import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";
import { LinkContainer } from "react-router-bootstrap";
import { logOut } from "../auth/firebase";
// Firebase imports
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import { Button } from "react-bootstrap";
import Logo from "../components/Logo";
import Footer from "../components/Footer";

const Layout = () => {
  const auth = getAuth();
  const [user] = useAuthState(auth);
  return (
    <Container className="main-container" fluid>
      <Row>
        <Navbar collapseOnSelect expand="lg" variant="dark">
          <Container className="justify-content-end">
            <LinkContainer to="/">
              <Navbar.Brand className="ml-auto">
                <Logo />
              </Navbar.Brand>
            </LinkContainer>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav>
                <LinkContainer to="/countries">
                  <Nav.Link>Countries</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/favourites">
                  <Nav.Link>Favourites</Nav.Link>
                </LinkContainer>
                {!user && (
                  <>
                    <LinkContainer to="/login">
                      <Nav.Link>Login</Nav.Link>
                    </LinkContainer>
                    <LinkContainer to="/register">
                      <Nav.Link>Register</Nav.Link>
                    </LinkContainer>
                  </>
                )}
                {user && (
                  <Button variant="custom" onClick={logOut}>
                    Log out
                  </Button>
                )}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </Row>
      <Row className="body-container">
        <Outlet />
      </Row>
      <Row className="footer-container">
        <Footer />
      </Row>
    </Container>
  );
};

export default Layout;

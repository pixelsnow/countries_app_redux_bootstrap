import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Row, Col } from "react-bootstrap";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";

const Home = () => {
  const [flags, setFlags] = useState([]);

  useEffect(() => {
    axios
      .get("https://restcountries.com/v3.1/all")
      .then((res) => {
        console.log("num", res.data.length);
        setFlags(res.data.map((country) => country.flags.svg));
      })
      .catch((err) => alert(err.message));
  }, []);

  useEffect(() => {
    console.log("num of flags", flags.length);
  }, [flags]);

  const auth = getAuth();
  const [user] = useAuthState(auth);

  return (
    <Col>
      <Row>
        <div className="slider">
          <div className="all-flags">
            {flags.map((flag) => (
              <div className="flag-container">
                <img alt="flag" key={flag} src={flag} />
              </div>
            ))}
            {flags.map((flag) => (
              <div className="flag-container">
                <img alt="flag" key={flag} src={flag} />
              </div>
            ))}
          </div>
        </div>
      </Row>
      <Row className="home-container">
        <Col className="home-content">
          <h1>Welcome to countries app</h1>
          <p>
            This is a simple React application that showcases all countries in
            the world
          </p>
          {!user && (
            <div className="call-to-action">
              <h3>Please login or sign up to browse countries</h3>
              <div className="buttons">
                <Button variant="custom">Log in</Button>
                <Button variant="custom">Sign up</Button>
              </div>
            </div>
          )}
          <h2>Technologies used</h2>
          <ul>
            <li>React</li>
            <li>Redux, RTK</li>
            <li>Firebase (authentication, data storage)</li>
            <li>Axios</li>
          </ul>
          <h2>Resources used</h2>
          <ul>
            <li>
              <a href="https://restcountries.com/">REST Countries API </a>
            </li>
            <li>
              <a href="https://openweathermap.org/">Open weather API</a>
            </li>
            <li>
              <a href="https://developers.google.com/maps/documentation/javascript">
                Google Maps Javascript API
              </a>
            </li>
            <li>
              <a href="https://developers.google.com/maps/documentation/javascript/reference/places-service">
                Google Places Service
              </a>
            </li>
          </ul>
        </Col>
      </Row>
    </Col>
  );
};

export default Home;

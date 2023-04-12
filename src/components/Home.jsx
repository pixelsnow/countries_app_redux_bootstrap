// React
import { useEffect } from "react";

// Redux
import { initializeCountries } from "../features/countries/countriesSlice";
import { useDispatch, useSelector } from "react-redux";

// Firebase
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";

// Bootstrap
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import LinkContainer from "react-router-bootstrap/LinkContainer";

const Home = () => {
  const dispatch = useDispatch();
  const countriesList = useSelector((state) => state.countries.countries);
  const loading = useSelector((state) => state.countries.isLoading);

  useEffect(() => {
    dispatch(initializeCountries());
  }, [dispatch]);

  const auth = getAuth();
  const [user] = useAuthState(auth);

  if (loading)
    return (
      <Col className="text-center m-5">
        <Spinner
          animation="border"
          role="status"
          className="center"
          variant="info"
        >
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Col>
    );
  return (
    <Col>
      <Row>
        <div className="slider">
          <div className="all-flags">
            {countriesList.map((country) => (
              <div key={country.name.common} className="flag-container">
                <LinkContainer
                  className="card-link-container"
                  to={`/countries/${country.name.common}`}
                  state={{ country: country }}
                >
                  <img alt="flag" src={country.flags.svg} />
                </LinkContainer>
              </div>
            ))}
            {countriesList.map((country) => (
              <div key={`${country.name.common}2`} className="flag-container">
                <LinkContainer
                  className="card-link-container"
                  to={`/countries/${country.name.common}`}
                  state={{ country: country }}
                >
                  <img alt="flag" src={country.flags.svg} />
                </LinkContainer>
              </div>
            ))}
          </div>
        </div>
      </Row>
      <Row className="home-container">
        <Col className="home-content">
          <h1>Welcome to countries app</h1>
          <p>
            A simple React application that allows you to explore the world.
            Built by <a href="https://github.com/pixelsnow">Valeria Vagapova</a>
          </p>
          {!user && (
            <div className="call-to-action">
              <h3>Please login or sign up to browse countries</h3>
              <div className="buttons">
                <LinkContainer to="/login">
                  <Button variant="custom">Log in</Button>
                </LinkContainer>
                <LinkContainer to="/register">
                  <Button variant="custom">Sign up</Button>
                </LinkContainer>
              </div>
            </div>
          )}
          <h2>Technologies used</h2>
          <ul>
            <li>React</li>
            <li>Redux, RTK</li>
            <li>Firebase (authentication, data storage)</li>
            <li>Bootstrap</li>
            <li>
              <a href="https://www.npmjs.com/package/axios">axios</a>
            </li>
            <li>
              <a href="https://www.npmjs.com/package/@react-google-maps/api">
                @react-google-maps/api
              </a>
            </li>
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
